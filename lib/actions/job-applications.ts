"use server";

import { revalidatePath } from "next/cache";

import { getSession } from "../auth/auth";
import connectDB from "../db";
import { Board, Column, JobApplication } from "../models";

interface JobApplicationData {
	company: string;
	position: string;
	location?: string;
	notes?: string;
	salary?: string;
	jobUrl?: string;
	columnId: string;
	boardId: string;
	tags?: string[];
	description?: string;
}

export async function createJobApplication(data: JobApplicationData) {
	const session = await getSession();

	if (!session?.user) {
		return { error: "Unauthorized." };
	}

	await connectDB();

	const {
		company,
		position,
		location,
		notes,
		salary,
		jobUrl,
		columnId,
		boardId,
		tags,
		description,
	} = data;

	if (!company || !position || !columnId || !boardId) {
		return { error: "Missing required fields." };
	}

	// Verify board ownership
	const board = await Board.findOne({
		_id: boardId,
		userId: session.user.id,
	});

	if (!board) {
		return { error: "Board not found." };
	}

	// Verify column belong to board
	const column = await Column.findOne({
		_id: columnId,
		boardId: boardId,
	});

	if (!column) {
		return { error: "Column not found." };
	}

	const maxOrder = (await JobApplication.findOne({ columnId })
		.sort({ order: -1 })
		.select("order")
		.lean()) as { order: number } | null;

	const jobApplication = await JobApplication.create({
		company,
		position,
		location,
		notes,
		salary,
		jobUrl,
		columnId,
		boardId,
		userId: session.user.id,
		tags: tags || [],
		description,
		status: "applied",
		order: maxOrder ? maxOrder.order + 1 : 0,
	});

	await Column.findByIdAndUpdate(columnId, {
		$push: { jobApplications: jobApplication._id },
	});

	revalidatePath("/dashboard");

	return { data: JSON.parse(JSON.stringify(jobApplication)) };
}

// Server action function that updates a job application with support for drag & drop reordering
// This handles both updating fields and moving cards between columns in a Kanban board
export async function updateJobApplication(
	id: string, // MongoDB _id of the job application to update
	updates: {
		company?: string;
		position?: string;
		location?: string;
		notes?: string;
		salary?: string;
		jobUrl?: string;
		columnId?: string; // Which column (stage) the card belongs to
		order?: number; // Position/order within the column (0-based index from drag)
		tags?: string[];
		description?: string;
	},
) {
	// ! AUTHENTICATION: Get the current user session
	const session = await getSession();

	// ! AUTHORIZATION: Check if user is logged in
	if (!session?.user) {
		return { error: "Unauthorized." };
	}

	// ! DATA FETCHING: Get the existing job application from database
	const jobApplication = await JobApplication.findById(id);

	// ! VALIDATION: Check if the job application exists
	if (!jobApplication) {
		return { error: "Job application not found " };
	}

	// ! AUTHORIZATION: Ensure the user owns this job application
	// Prevents users from modifying other users' applications
	if (jobApplication.userId !== session.user.id) {
		return { error: "Unauthorized." };
	}

	// ! DESTRUCTURING: Separate column/order updates from other fields
	// columnId and order need special handling for the drag & drop logic
	const { columnId, order, ...otherUpdates } = updates;

	// ! TYPE SAFETY: Create a typed object for the updates we'll apply
	// This ensures we only update valid fields
	const updatesToApply: Partial<{
		company: string;
		position: string;
		location: string;
		notes: string;
		salary: string;
		jobUrl: string;
		columnId: string;
		order: number;
		tags: string[];
		description: string;
	}> = otherUpdates;

	// ! COMPARISON: Convert IDs to strings for reliable comparison
	const currentColumnId = jobApplication.columnId.toString();
	const newColumnId = columnId?.toString();

	// ! LOGIC: Check if the card is being moved to a different column
	// Example: moving from "Applied" to "Interview" stage
	const isMovingToDifferentColumn =
		newColumnId && newColumnId !== currentColumnId;

	// ! SCENARIO 1: Moving card to a DIFFERENT column
	if (isMovingToDifferentColumn) {
		// ! STEP 1: Remove the job reference from the OLD column
		// $pull removes the job ID from the column's jobApplication array
		await Column.findByIdAndUpdate(currentColumnId, {
			$pull: { jobApplications: id },
		});

		// ! STEP 2: Get all jobs in the TARGET column (excluding the one being moved)
		// Sort by order to maintain proper sequence
		const jobsInTargetColumn = await JobApplication.find({
			columnId: newColumnId,
			_id: { $ne: id },
		})
			.sort({ order: 1 })
			.lean();

		// ! STEP 3: Calculate the new order position
		let newOrderValue: number;

		if (order !== undefined && order !== null) {
			// ! CASE A: User specified a specific position (from drag & drop)
			// Convert 0-based index to 100-based step to allow insertions between items
			newOrderValue = order * 100;

			// ! Shift down all items after the insertion point
			// Example: Inserting at position 2, shift items from position 2 onwards
			const jobsThatNeedToShift = jobsInTargetColumn.slice(order);
			for (const job of jobsThatNeedToShift) {
				await JobApplication.findByIdAndUpdate(job._id, {
					$set: { order: job.order + 100 }, // Add 100 to create space
				});
			}
		} else {
			// ! CASE B: No position specified, append to the end
			if (jobsInTargetColumn.length > 0) {
				// Get the highest order value and add 100
				const lastJobOrder =
					jobsInTargetColumn[jobsInTargetColumn.length - 1].order || 0;
				newOrderValue = lastJobOrder + 100;
			} else {
				// If column is empty, start at 0
				newOrderValue = 0;
			}
		}

		// ! STEP 4: Apply the column and order updates
		updatesToApply.columnId = newColumnId;
		updatesToApply.order = newOrderValue;

		// ! STEP 5: Add the job reference to the NEW column
		// $push adds the job ID to the column's jobApplication array
		await Column.findByIdAndUpdate(newColumnId, {
			$push: { jobApplications: id },
		});
	}
	// ! SCENARIO 2: Moving card within the SAME column (reordering)
	else if (order !== undefined && order !== null) {
		// ! STEP 1: Get all other jobs in the same column, sorted by order
		const otherJobsInColumn = await JobApplication.find({
			columnId: currentColumnId,
			_id: { $ne: id },
		})
			.sort({ order: 1 })
			.lean();

		// ! STEP 2: Find the current position of this job
		const currentJobOrder = jobApplication.order || 0;
		const currentPositionIndex = otherJobsInColumn.findIndex(
			(job) => job.order > currentJobOrder,
		);
		const oldPositionIndex =
			currentPositionIndex === -1
				? otherJobsInColumn.length // If not found, it's at the end
				: currentPositionIndex;

		// ! STEP 3: Convert the new position to our 100-based system
		const newOrderValue = order * 100;

		// ! STEP 4: Handle moving UP (earlier position)
		// Example: Moving from position 3 to 1 (items 1-2 shift down)
		if (order < oldPositionIndex) {
			// Items between the new position and old position need to shift down
			const jobsToShiftDown = otherJobsInColumn.slice(order, oldPositionIndex);

			for (const job of jobsToShiftDown) {
				await JobApplication.findByIdAndUpdate(job._id, {
					$set: { order: job.order + 100 }, // Move them down one position
				});
			}
		}
		// ! STEP 5: Handle moving DOWN (later position)
		// Example: Moving from position 1 to 3 (items 2-3 shift up)
		else if (order > oldPositionIndex) {
			// Items between old position and new position need to shift up
			const jobsToShiftUp = otherJobsInColumn.slice(oldPositionIndex, order);

			for (const job of jobsToShiftUp) {
				const newOrder = Math.max(0, job.order - 100); // Move them up one position, ensure not negative

				await JobApplication.findByIdAndUpdate(job._id, {
					$set: { order: newOrder },
				});
			}
		}
		// If order === oldPositionIndex, no movement needed (position unchanged)

		// ! STEP 6: Update this job's order to its new position

		updatesToApply.order = newOrderValue;
	}

	// ! FINAL UPDATE: Apply all changes to the job application
	// { new: true } returns the updated document
	const updated = await JobApplication.findByIdAndUpdate(id, updatesToApply, {
		new: true,
	});

	// ! RESPONSE: Return the updated data & refresh the cache
	revalidatePath("/dashboard");

	// JSON.parse(JSON.stringify()) converts MongoDB document to plain object
	return { data: JSON.parse(JSON.stringify(updated)) };
}
