import { defineType, defineField } from "sanity";

export const gallery = defineType({
  name: "galleryItem",
  title: "Gallery Item",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "mediaType",
      title: "Media Type",
      type: "string",
      options: {
        list: [
          { title: "Image", value: "image" },
          { title: "Video", value: "video" },
        ],
      },
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.mediaType !== "image",
    }),
    defineField({
      name: "video",
      title: "Video File",
      type: "file",
      options: {
        accept: "video/*", // hanya bisa upload video
      },
      hidden: ({ parent }) => parent?.mediaType !== "video",
    }),
  ],

  preview: {
    select: {
      title: "title",
      subtitle: "mediaType",
      media: "image",
    },
  },
});
