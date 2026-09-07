import bcrypt from "bcryptjs";
import {
	ActivityAction,
	MembershipStatus,
	OrganizationRole,
	OrganizationStatus,
	PaymentProvider,
	PaymentStatus,
	PlatformRole,
	ProjectStatus,
	SprintStatus,
	SubscriptionStatus,
	TaskPriority,
	TaskStatus,
} from "../../generated/enums";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/client";

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
	adapter,
});

const seed = async () => {
	console.log("🌱 Seeding database...");

	// =========================
	// PASSWORD
	// =========================

	const password = await bcrypt.hash("Password123!", 10);

	// =========================
	// USERS
	// =========================

	const superAdmin = await prisma.user.upsert({
		where: {
			email: "admin@example.com",
		},
		update: {},
		create: {
			name: "Super Admin",
			email: "admin@example.com",
			password,
			platformRole: PlatformRole.SUPER_ADMIN,
			isActive: true,
		},
	});

	const owner = await prisma.user.upsert({
		where: {
			email: "owner@example.com",
		},
		update: {},
		create: {
			name: "John Owner",
			email: "owner@example.com",
			password,
			platformRole: PlatformRole.USER,
			isActive: true,
		},
	});

	const admin = await prisma.user.upsert({
		where: {
			email: "admin.user@example.com",
		},
		update: {},
		create: {
			name: "Organization Admin",
			email: "admin.user@example.com",
			password,
			platformRole: PlatformRole.USER,
			isActive: true,
		},
	});

	const member = await prisma.user.upsert({
		where: {
			email: "member@example.com",
		},
		update: {},
		create: {
			name: "Team Member",
			email: "member@example.com",
			password,
			platformRole: PlatformRole.USER,
			isActive: true,
		},
	});

	const member2 = await prisma.user.upsert({
		where: {
			email: "member2@example.com",
		},
		update: {},
		create: {
			name: "Second Member",
			email: "member2@example.com",
			password,
			platformRole: PlatformRole.USER,
			isActive: true,
		},
	});

	console.log("✅ Users created");

	// =========================
	// ORGANIZATION
	// =========================

	const organization = await prisma.organization.upsert({
		where: {
			slug: "acme-corporation",
		},
		update: {},
		create: {
			name: "Acme Corporation",
			slug: "acme-corporation",
			ownerId: owner.id,
			status: OrganizationStatus.ACTIVE,
		},
	});

	console.log("✅ Organization created");

	// =========================
	// MEMBERSHIPS
	// =========================

	const ownerMembership = await prisma.membership.upsert({
		where: {
			userId_organizationId: {
				userId: owner.id,
				organizationId: organization.id,
			},
		},
		update: {},
		create: {
			userId: owner.id,
			organizationId: organization.id,
			role: OrganizationRole.OWNER,
			status: MembershipStatus.ACTIVE,
		},
	});

	const adminMembership = await prisma.membership.upsert({
		where: {
			userId_organizationId: {
				userId: admin.id,
				organizationId: organization.id,
			},
		},
		update: {},
		create: {
			userId: admin.id,
			organizationId: organization.id,
			role: OrganizationRole.ORG_ADMIN,
			status: MembershipStatus.ACTIVE,
		},
	});

	const memberMembership = await prisma.membership.upsert({
		where: {
			userId_organizationId: {
				userId: member.id,
				organizationId: organization.id,
			},
		},
		update: {},
		create: {
			userId: member.id,
			organizationId: organization.id,
			role: OrganizationRole.MEMBER,
			status: MembershipStatus.ACTIVE,
		},
	});

	const member2Membership = await prisma.membership.upsert({
		where: {
			userId_organizationId: {
				userId: member2.id,
				organizationId: organization.id,
			},
		},
		update: {},
		create: {
			userId: member2.id,
			organizationId: organization.id,
			role: OrganizationRole.MEMBER,
			status: MembershipStatus.ACTIVE,
		},
	});

	console.log("✅ Memberships created");

	// =========================
	// SUBSCRIPTION
	// =========================

	const subscription = await prisma.subscription.upsert({
		where: {
			organizationId: organization.id,
		},
		update: {
			status: SubscriptionStatus.ACTIVE,
		},
		create: {
			organizationId: organization.id,
			status: SubscriptionStatus.ACTIVE,
			startDate: new Date(),
		},
	});

	console.log("✅ Subscription created");

	// =========================
	// PAYMENT
	// =========================

	await prisma.payment.upsert({
		where: {
			subscriptionId: subscription.id,
		},
		update: {},
		create: {
			subscriptionId: subscription.id,
			transactionId: `SEED-${Date.now()}`,
			amount: 1000,
			currency: "BDT",
			provider: PaymentProvider.SSLCOMMERZ,
			status: PaymentStatus.SUCCESS,
			paidAt: new Date(),

			// Demo data only
			cardBrand: "VISA",
			cardType: "DEBIT",
			cardIssuer: "Demo Bank",
			cardCategory: "STANDARD",
			riskLevel: "0",
		},
	});

	console.log("✅ Payment created");

	// =========================
	// TEAM
	// =========================

	const developmentTeam = await prisma.team.upsert({
		where: {
			name_organizationId: {
				name: "Development Team",
				organizationId: organization.id,
			},
		},
		update: {},
		create: {
			name: "Development Team",
			description: "Main software development team",
			organizationId: organization.id,
		},
	});

	const designTeam = await prisma.team.upsert({
		where: {
			name_organizationId: {
				name: "Design Team",
				organizationId: organization.id,
			},
		},
		update: {},
		create: {
			name: "Design Team",
			description: "UI/UX design team",
			organizationId: organization.id,
		},
	});

	console.log("✅ Teams created");

	// =========================
	// TEAM MEMBERSHIPS
	// =========================

	await prisma.teamMembership.upsert({
		where: {
			teamId_membershipId: {
				teamId: developmentTeam.id,
				membershipId: ownerMembership.id,
			},
		},
		update: {},
		create: {
			teamId: developmentTeam.id,
			membershipId: ownerMembership.id,
		},
	});

	await prisma.teamMembership.upsert({
		where: {
			teamId_membershipId: {
				teamId: developmentTeam.id,
				membershipId: adminMembership.id,
			},
		},
		update: {},
		create: {
			teamId: developmentTeam.id,
			membershipId: adminMembership.id,
		},
	});

	await prisma.teamMembership.upsert({
		where: {
			teamId_membershipId: {
				teamId: developmentTeam.id,
				membershipId: memberMembership.id,
			},
		},
		update: {},
		create: {
			teamId: developmentTeam.id,
			membershipId: memberMembership.id,
		},
	});

	await prisma.teamMembership.upsert({
		where: {
			teamId_membershipId: {
				teamId: developmentTeam.id,
				membershipId: member2Membership.id,
			},
		},
		update: {},
		create: {
			teamId: developmentTeam.id,
			membershipId: member2Membership.id,
		},
	});

	console.log("✅ Team memberships created");

	// =========================
	// PROJECT
	// =========================

	const project = await prisma.project.create({
		data: {
			name: "SaaS Project Management Platform",
			description: "A complete project management platform for organizations.",
			organizationId: organization.id,
			teamId: developmentTeam.id,
			status: ProjectStatus.PLANNING,
			startDate: new Date(),
			endDate: new Date(new Date().setDate(new Date().getDate() + 60)),
			createdById: owner.id,
		},
	});

	const websiteProject = await prisma.project.create({
		data: {
			name: "Company Website",
			description: "Build the new company website.",
			organizationId: organization.id,
			teamId: designTeam.id,
			status: ProjectStatus.PLANNING,
			startDate: new Date(),
			endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
			createdById: admin.id,
		},
	});

	console.log("✅ Projects created");

	// =========================
	// SPRINT
	// =========================

	const sprint = await prisma.sprint.create({
		data: {
			name: "Sprint 1",
			goal: "Build authentication and organization management.",
			projectId: project.id,
			status: SprintStatus.PLANNED,
			startDate: new Date(),
			endDate: new Date(new Date().setDate(new Date().getDate() + 14)),
			createdById: owner.id,
		},
	});

	const sprint2 = await prisma.sprint.create({
		data: {
			name: "Sprint 2",
			goal: "Build project, sprint and task management.",
			projectId: project.id,
			status: SprintStatus.PLANNED,
			startDate: new Date(new Date().setDate(new Date().getDate() + 15)),
			endDate: new Date(new Date().setDate(new Date().getDate() + 29)),
			createdById: owner.id,
		},
	});

	console.log("✅ Sprints created");

	// =========================
	// TASKS
	// =========================

	const task1 = await prisma.task.create({
		data: {
			title: "Implement User Authentication",
			description: "Implement register, login and JWT authentication.",
			organizationId: organization.id,
			projectId: project.id,
			sprintId: sprint.id,
			assigneeId: member.id,
			createdById: owner.id,
			status: TaskStatus.TODO,
			priority: TaskPriority.HIGH,
			dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
		},
	});

	const task2 = await prisma.task.create({
		data: {
			title: "Implement Google Login",
			description: "Integrate Google OAuth login.",
			organizationId: organization.id,
			projectId: project.id,
			sprintId: sprint.id,
			assigneeId: admin.id,
			createdById: owner.id,
			status: TaskStatus.TODO,
			priority: TaskPriority.MEDIUM,
			dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
		},
	});

	const task3 = await prisma.task.create({
		data: {
			title: "Create Project Dashboard",
			description: "Build the project dashboard UI and API.",
			organizationId: organization.id,
			projectId: project.id,
			sprintId: sprint2.id,
			assigneeId: member2.id,
			createdById: admin.id,
			status: TaskStatus.TODO,
			priority: TaskPriority.MEDIUM,
			dueDate: new Date(new Date().setDate(new Date().getDate() + 20)),
		},
	});

	const task4 = await prisma.task.create({
		data: {
			title: "Design Landing Page",
			description: "Create landing page design.",
			organizationId: organization.id,
			projectId: websiteProject.id,
			assigneeId: member2.id,
			createdById: admin.id,
			status: TaskStatus.TODO,
			priority: TaskPriority.LOW,
		},
	});

	console.log("✅ Tasks created");

	// =========================
	// COMMENTS
	// =========================

	await prisma.comment.create({
		data: {
			content: "Authentication implementation has been started.",
			taskId: task1.id,
			userId: owner.id,
		},
	});

	await prisma.comment.create({
		data: {
			content: "I will complete the Google login integration.",
			taskId: task2.id,
			userId: admin.id,
		},
	});

	await prisma.comment.create({
		data: {
			content: "Dashboard API requirements are clear.",
			taskId: task3.id,
			userId: member2.id,
		},
	});

	console.log("✅ Comments created");

	// =========================
	// ACTIVITY LOGS
	// =========================

	await prisma.activityLog.createMany({
		data: [
			{
				action: ActivityAction.PROJECT_CREATED,
				entityType: "Project",
				entityId: project.id,
				organizationId: organization.id,
				userId: owner.id,
				metadata: {
					projectName: project.name,
				},
			},
			{
				action: ActivityAction.SPRINT_STARTED,
				entityType: "Sprint",
				entityId: sprint.id,
				organizationId: organization.id,
				userId: owner.id,
				metadata: {
					sprintName: sprint.name,
				},
			},
			{
				action: ActivityAction.TASK_CREATED,
				entityType: "Task",
				entityId: task1.id,
				organizationId: organization.id,
				userId: owner.id,
				metadata: {
					title: task1.title,
				},
			},
			{
				action: ActivityAction.TASK_ASSIGNED,
				entityType: "Task",
				entityId: task1.id,
				organizationId: organization.id,
				userId: owner.id,
				metadata: {
					assigneeId: member.id,
				},
			},
			{
				action: ActivityAction.COMMENT_CREATED,
				entityType: "Comment",
				entityId: task1.id,
				organizationId: organization.id,
				userId: owner.id,
				metadata: {
					taskId: task1.id,
				},
			},
		],
	});

	console.log("✅ Activity logs created");

	console.log("\n🎉 Database seeded successfully!");

	console.log("\n📋 Demo Accounts:");
	console.log("--------------------------------");
	console.log("Super Admin");
	console.log("Email: admin@example.com");
	console.log("Password: Password123!");
	console.log("--------------------------------");
	console.log("Organization Owner");
	console.log("Email: owner@example.com");
	console.log("Password: Password123!");
	console.log("--------------------------------");
	console.log("Organization Admin");
	console.log("Email: admin.user@example.com");
	console.log("Password: Password123!");
	console.log("--------------------------------");
	console.log("Member");
	console.log("Email: member@example.com");
	console.log("Password: Password123!");
	console.log("--------------------------------");
};

// seed()
//   .catch((error) => {
//     console.error("❌ Seed failed:");
//     console.error(error);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

export default seed;
