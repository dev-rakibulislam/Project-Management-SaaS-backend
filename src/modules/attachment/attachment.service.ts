import type { UploadApiResponse } from "cloudinary";
import AppError from "../../error/appError";
import cloudinary from "../../lib/cloudinary";
import { prisma } from "../../lib/prisma";
import { makeNoise } from "../../utils/makeNoise";

const createAttachmentService = async (
	organizationId: string,
	taskId: string,
	userId: string,
	file: Buffer,
	filename: string,
) => {
	const task = await prisma.task.findFirst({
		where: {
			id: taskId,
			organizationId,
			deletedAt: null,
		},
	});

	if (!task) {
		throw new AppError(404, "Task not found.");
	}

	const cloudinaryResult = await new Promise<UploadApiResponse>(
		(resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				{
					resource_type: "auto",
					folder: "task-attachments",
				},
				(error, result) => {
					if (error) {
						reject(new AppError(error.http_code || 500, error.message));
						return;
					}

					if (!result) {
						reject(new AppError(400, "Upload not completed. Try again."));
						return;
					}

					resolve(result);
				},
			);

			uploadStream.end(file);
		},
	);

	const attachment = await prisma.attachment.create({
		data: {
			taskId,
			fileUrl: cloudinaryResult.secure_url,
			fileName: filename,
			publicId: cloudinaryResult.public_id,
			fileType: cloudinaryResult.resource_type,
			fileSize: cloudinaryResult.bytes,
			uploadedById: userId,
		},
	});

	await makeNoise({
		entityId: attachment.id,
		action: "ATTACHMENT_ADD",
		entityType: "ATTACHMENT",
		organizationId: organizationId,
		userId,
	});

	return attachment;
};

export const attachmentService = {
	createAttachmentService,
};
