import { Post } from "@prisma/client";
import clsx from "clsx";
import React from "react";
import { FieldValues, useForm } from "react-hook-form";
// import { useFetcher } from "react-router-dom";
import { useFetcher } from "@remix-run/react";
import { useGlobalCtx } from "~/lib/global-ctx";
import { uploadMedia } from "~/lib/upload-media";
import { AudioRecorder } from "./audio-recorder";
import { Button } from "./button";
import { Content } from "./content";
import { FileInput } from "./file-input";
import { FileSelectItem } from "./file-select-item";
import {
  DEFAULT_SELECTIONS,
  SelectionId,
  Selections,
  TagInput,
  stringifySelections,
} from "./tag-input";
import { TagSelect } from "./tag-select";

interface Props {
  level?: number;
  parent?: Post;
}

const ATTACHMENT_LIMIT = 5 * 1024 * 1024; // 5MB limit

function PostInput({ level = 0, parent }: Props) {
  const { getValues, handleSubmit, register, setValue, watch, reset } = useForm(
    {
      defaultValues: {
        content: "",
        files: [] as File[],
      },
    }
  );

  const [isRecording, setIsRecording] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [tags, setTags] = React.useState<Selections>(DEFAULT_SELECTIONS);
  const [isPreviewing, setIsPreviewing] = React.useState(false);

  const fetcher = useFetcher();
  const previewFetcher = useFetcher();

  const { user } = useGlobalCtx();

  const isComment = level > 0;
  const $files = watch("files");

  function loadPreview() {
    const content = getValues("content");

    if (!content.trim()) {
      return;
    }

    previewFetcher.submit(JSON.stringify({ content }), {
      method: "POST",
      action: "/md",
      encType: "application/json",
    });
  }

  async function createPost(data: FieldValues) {
    setUploading(true);
    const media = await Promise.all($files.map(uploadMedia));
    setUploading(false);

    const stringifiedTags = stringifySelections(tags);

    fetcher.submit(
      JSON.stringify({
        ...data,
        parentId: parent?.id,
        media,
        tags: stringifiedTags,
      }),
      {
        encType: "application/json",
        method: "POST",
      }
    );
  }

  function handleFilesSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) {
      return;
    }

    const files = Array.from(e.target.files);

    if (files.some((file) => file.size > ATTACHMENT_LIMIT)) {
      alert("Some files you selected are too large. Maximum 5MB per file.");
      return;
    }

    setValue("files", [...$files, ...files].slice(0, 5));
  }

  function handleTagRemove(id: SelectionId, value: string) {
    setTags((tags) => {
      const values = tags[id].filter((it) => it !== value);
      return { ...tags, [id]: values };
    });
  }

  const handleRecordComplete = React.useCallback(
    (blob: Blob) => {
      const name = getNextRecordingName($files);
      const file = new File([blob], name, { type: "audio/mp3" });

      if (file.size > ATTACHMENT_LIMIT) {
        alert("The recording is too large. Maximum 5MB per file.");
        return;
      }

      setValue("files", [...$files, file].slice(0, 5));
    },
    [$files, setValue]
  );

  function removeFile(index: number) {
    setValue(
      "files",
      $files.filter((_, i) => i !== index)
    );
  }

  function togglePreview() {
    if (!isPreviewing) {
      const content = getValues("content");
      if (!content.trim()) {
        return;
      }

      loadPreview();
    }

    setIsPreviewing(!isPreviewing);
  }

  React.useEffect(() => {
    if (fetcher.data) {
      reset();
      setTags(DEFAULT_SELECTIONS);
      setIsPreviewing(false);
    }
  }, [fetcher.data, reset]);

  const posting = fetcher.state === "submitting" || uploading;

  const hidePreview = previewFetcher.state !== "idle" || !isPreviewing;

  return (
    <>
      <form onSubmit={handleSubmit(createPost)}>
        {!parent && (
          <header>
            <TagSelect tags={tags} onRemove={handleTagRemove} />
          </header>
        )}

        <textarea
          className={clsx(
            "w-full rounded-lg bg-zinc-100 dark:bg-neutral-800 border-zinc-200 dark:border-neutral-700 p-2 h-30",
            { hidden: !hidePreview }
          )}
          placeholder={
            isComment ? "What do you think?" : "What have you got to share?"
          }
          maxLength={1024}
          {...register("content", {
            required: true,
            setValueAs(value) {
              return value.trim();
            },
          })}
          disabled={posting || isPreviewing}
        />

        <div
          className={clsx(
            "min-h-[5rem] bg-zinc-100 dark:bg-neutral-800 rounded-lg pt-0 mb-2 border-2 border-blue-600",
            {
              hidden: hidePreview,
            }
          )}
        >
          <div className="-mt-1">
            <div className="text-sm bg-blue-600 text-white inline-block px-2 rounded-rb-lg rounded-tl-md font-medium">
              Preview mode
            </div>
          </div>

          <div className="px-2 py-1">
            <Content content={(previewFetcher.data as any)?.rendered} />
          </div>

          <div className="bg-zinc-200 dark:bg-neutral-700 bg-opacity-50 text-secondary inline-block text-sm rounded-lg px-2 mb-1 ms-2 font-medium">
            Tap <span className="inline-block i-lucide-pen" /> to go back to
            edit mode.
          </div>
        </div>

        <div
          className={clsx(
            "grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2 flex-wrap",
            { "mb-2": $files.length }
          )}
        >
          {$files.map((file, i) => (
            <div className="col-span-1" key={`${file.name}-${i}`}>
              <FileSelectItem
                file={file}
                onRemove={() => !uploading && removeFile(i)}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-between flex-wrap gap-y-2">
          <div className="flex gap-2">
            <FileInput
              name="files"
              multiple
              maxLength={4}
              accept="image/png,image/jpeg,image/gif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,audio/*"
              onChange={handleFilesSelect}
              disabled={posting || $files.length >= 5}
            >
              <div className="i-lucide-file-symlink opacity-50 shrink-0" />
              Add files
            </FileInput>

            <div className="flex [&>*:last-child]:rounded-e-full [&>*:first-child]:rounded-s-full">
              <AudioRecorder
                onRecorded={handleRecordComplete}
                onRecording={setIsRecording}
              />

              {!isRecording && (
                <>
                  {!parent && <TagInput value={tags} onDone={setTags} />}

                  <button
                    className="size-8 bg-zinc-200 dark:bg-neutral-800 inline-flex justify-center items-center"
                    type="button"
                    title={isPreviewing ? "Edit mode" : "Preview mode"}
                    onClick={togglePreview}
                  >
                    <span
                      className={clsx("inline-block i-lucide-eye", {
                        "!i-svg-spinners-180-ring-with-bg":
                          previewFetcher.state !== "idle",
                        "i-lucide-pencil":
                          previewFetcher.state === "idle" && isPreviewing,
                      })}
                    />
                  </button>
                </>
              )}
            </div>
          </div>

          <div>
            <Button disabled={posting || !user}>
              {posting ? (
                <>
                  <span className="i-svg-spinners-180-ring-with-bg" /> Posting…
                </>
              ) : isComment ? (
                "Comment"
              ) : (
                "Start Discussion"
              )}
            </Button>
          </div>
        </div>

        <p className="text-sm text-secondary">
          5 files max. Images and docs only. 5MB limit per file.
          <br />
          <a
            className="underline"
            target="_blank"
            href="https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax"
            rel="noreferrer"
          >
            Markdown
          </a>{" "}
          is supported.
        </p>
      </form>
    </>
  );
}

function getNextRecordingName(files: File[]) {
  const nextNumber = files.filter((file) =>
    file.name.startsWith("Recording")
  ).length;
  return `Recording-${nextNumber + 1}.mp3`;
}

export { PostInput };
