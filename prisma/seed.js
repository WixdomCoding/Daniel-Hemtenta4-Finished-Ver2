const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() { // Creates an initial entry in the database 
    const starter = await prisma.available.create({
        data: {

            isAvailable: true,

        },
    })
    console.log({ starter })
}

main() 
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })