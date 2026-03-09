import type { RefObject } from "react"
import { Avatar, AvatarImage } from "../ui/avatar"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Send, XIcon } from "lucide-react"
import type { IUser } from "@/interfaces/IUser"
import type { IComment } from "@/interfaces/IPhoto"

type CommentInputSectionProps = {
  currentUser: IUser
  replyingToComment: IComment | null
  newComment: string
  onChangeComment: (value: string) => void
  onClearReply: () => void
  onSubmit: () => void
  inputRef: RefObject<HTMLInputElement | null>
}

const CommentInputSection = ({
  currentUser,
  replyingToComment,
  newComment,
  onChangeComment,
  onClearReply,
  onSubmit,
  inputRef,
}: CommentInputSectionProps) => (
  <div className="flex flex-row items-end gap-2 px-6 py-4">
    <Avatar className="mb-1">
      <AvatarImage src={currentUser?.profile_picture.url} />
    </Avatar>
    <div className="relative w-full">
      {replyingToComment && (
        <div
          className="text-xs text-muted-foreground flex flex-row items-center justify-start gap-1 mb-2"
          onClick={onClearReply}
        >
          <XIcon className="size-4 cursor-pointer" />
          Replying to {replyingToComment.user_summary.username}
        </div>
      )}
      <Input
        ref={inputRef}
        name="comment-input"
        className="w-full text-sm pr-10 h-10"
        type="text"
        placeholder="Add a comment"
        value={newComment}
        onChange={(e) => onChangeComment(e.target.value)}
      />
      {newComment.trim().length > 0 && (
        <Button className="absolute right-1 bottom-1" onClick={onSubmit}>
          <Send className="h-4 w-4" />
        </Button>
      )}
    </div>
  </div>
)

export default CommentInputSection
