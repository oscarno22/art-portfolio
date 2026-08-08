import { defineField, defineType } from "sanity";

export const artwork = defineType({
  name: "artwork",
  title: "Artwork",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mainImage",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "medium",
      title: "Medium",
      type: "string",
      description: 'e.g. "Oil on canvas", "Watercolor", "Mixed media"',
    }),
    defineField({
      name: "dimensions",
      title: "Dimensions",
      type: "string",
      description: 'e.g. "24\\" × 36\\""',
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "Show on the homepage",
      initialValue: false,
    }),
    defineField({
      name: "status",
      title: "Availability",
      type: "string",
      description:
        "Display only = shown in the gallery but not for sale. Sold pieces can be re-listed at any time by switching back to For sale.",
      options: {
        list: [
          { title: "Display only", value: "display" },
          { title: "For sale", value: "forSale" },
          { title: "Sold", value: "sold" },
        ],
        layout: "radio",
      },
      initialValue: "display",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price (USD)",
      type: "number",
      // Stays visible on sold pieces so the price survives a re-list.
      hidden: ({ document }) => document?.status === "display",
      validation: (Rule) =>
        Rule.custom((price, context) =>
          context.document?.status === "forSale" && !price
            ? "A price is required before a piece can go up for sale."
            : true
        ),
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "mainImage",
      medium: "medium",
      status: "status",
    },
    prepare({ title, media, medium, status }) {
      const label = { forSale: "For sale", sold: "Sold" }[status as string];
      return {
        title,
        media,
        subtitle: [medium, label].filter(Boolean).join(" · "),
      };
    },
  },
});
