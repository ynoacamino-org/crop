import { z } from "zod";

export const idSchema = z
	.string({ message: "Se espera que el identificador sea una cadena de texto" })
	.min(1, { message: "El identificador no puede estar vacío" });
