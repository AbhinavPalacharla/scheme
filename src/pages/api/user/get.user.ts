import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.query;

  const user = await prisma.user.findUnique({
    where: {
      id: userId as string,
    },
    select: {
      id: true,
      name: true,
      username: true,
    },
  });

  if (!user) {
    return res.status(400).send({
      error: "User not found",
    });
  }

  return res.status(200).send(user);
};

export default handler;
