import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: z.object({
				/** The people who wrote this page. Always a list, even for one author. */
				authors: z
					.array(
						z.object({
							name: z.string().min(1),
							/** Optional site to link the author's name to. */
							url: z.url().optional(),
						})
					)
					.nonempty()
					.optional(),
			}),
		}),
	}),
};
