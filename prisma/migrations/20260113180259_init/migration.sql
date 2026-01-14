-- CreateTable
CREATE TABLE "Onboarding" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "whopId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "OnboardingVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "onboardingId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL,
    "publishedAt" DATETIME,
    "publishedBy" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#141212',
    "secondaryColor" TEXT NOT NULL DEFAULT '#FA4616',
    "lightColor" TEXT NOT NULL DEFAULT '#FCF6F5',
    "gradientStops" TEXT,
    "buttonRadius" INTEGER NOT NULL DEFAULT 12,
    "buttonStyle" TEXT NOT NULL DEFAULT 'solid',
    "logoUrl" TEXT,
    "coverImageUrl" TEXT,
    "mode" TEXT NOT NULL DEFAULT 'dark',
    "welcomeTitle" TEXT,
    "welcomeSubtitle" TEXT,
    "welcomeCompleted" BOOLEAN NOT NULL DEFAULT false,
    "steps" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "OnboardingVersion_onboardingId_fkey" FOREIGN KEY ("onboardingId") REFERENCES "Onboarding" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OnboardingProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "versionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT,
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "stepData" TEXT,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "OnboardingProgress_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "OnboardingVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StepProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "progressId" TEXT NOT NULL,
    "stepIndex" INTEGER NOT NULL,
    "stepType" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "completedAt" DATETIME,
    CONSTRAINT "StepProgress_progressId_fkey" FOREIGN KEY ("progressId") REFERENCES "OnboardingProgress" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Onboarding_whopId_key" ON "Onboarding"("whopId");

-- CreateIndex
CREATE INDEX "Onboarding_whopId_idx" ON "Onboarding"("whopId");

-- CreateIndex
CREATE INDEX "OnboardingVersion_onboardingId_status_idx" ON "OnboardingVersion"("onboardingId", "status");

-- CreateIndex
CREATE INDEX "OnboardingVersion_status_idx" ON "OnboardingVersion"("status");

-- CreateIndex
CREATE INDEX "OnboardingProgress_versionId_idx" ON "OnboardingProgress"("versionId");

-- CreateIndex
CREATE INDEX "OnboardingProgress_userId_idx" ON "OnboardingProgress"("userId");

-- CreateIndex
CREATE INDEX "OnboardingProgress_completed_idx" ON "OnboardingProgress"("completed");

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingProgress_versionId_userId_key" ON "OnboardingProgress"("versionId", "userId");

-- CreateIndex
CREATE INDEX "StepProgress_progressId_idx" ON "StepProgress"("progressId");

-- CreateIndex
CREATE UNIQUE INDEX "StepProgress_progressId_stepIndex_key" ON "StepProgress"("progressId", "stepIndex");
