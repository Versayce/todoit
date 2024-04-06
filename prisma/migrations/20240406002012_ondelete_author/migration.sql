-- DropForeignKey
ALTER TABLE "UserTask" DROP CONSTRAINT "UserTask_authorId_fkey";

-- AddForeignKey
ALTER TABLE "UserTask" ADD CONSTRAINT "UserTask_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
