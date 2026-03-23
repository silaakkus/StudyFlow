import { prisma } from "@/lib/prisma"

export const getDemoUser = async () => {
  return prisma.user.upsert({
    where: { email: "demo@studyflow.local" },
    update: {},
    create: {
      email: "demo@studyflow.local",
      name: "Demo User",
    },
  })
}
