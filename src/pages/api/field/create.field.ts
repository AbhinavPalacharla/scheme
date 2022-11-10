//Next
import { NextApiRequest, NextApiResponse } from "next";

//Utils
// import { prisma } from "../../../utils/prisma";
import { prisma, handleError } from "@utils";

//Auth
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "@auth/[...nextauth]";

// HTTP error codes
import { ReasonPhrases, StatusCodes } from "http-status-codes";

//Types
import type { FieldType, FieldFormat } from "@prisma/client";

type RequestBody = {
  modelId: string;
  name: string;
  type: FieldType;
  optional?: boolean;
  array?: boolean;
  format?: FieldFormat;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(StatusCodes.UNAUTHORIZED).send({
      error: ReasonPhrases.UNAUTHORIZED,
    });
  }

  const { modelId, name, type, optional, array, format }: RequestBody =
    req.body;

  try {
    const model = await prisma.model.update({
      where: {
        id: modelId,
      },
      data: {
        fields: {
          create: {
            name: name,
            type: type,
            optional: optional || false,
            array: array || false,
            format: format || "NONE",
          },
        },
      },
    });

    return res.status(StatusCodes.OK).json(model);
  } catch (error) {
    handleError(error, res);
  }
};

export default handler;
