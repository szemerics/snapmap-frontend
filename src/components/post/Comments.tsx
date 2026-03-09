import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "../ui/drawer"
import { useMediaQuery } from "@/hooks/use-media-query"
import type { IComment, IPhoto } from "@/interfaces/IPhoto"
import { Avatar, AvatarImage } from "../ui/avatar"
import { formatDate } from "./helpers"
import { Separator } from "../ui/separator"
import { Input } from "../ui/input"
import { Send, XIcon } from "lucide-react"
import { photoService } from "@/services/photo.service"
import type { IUser } from "@/interfaces/IUser"
import { useNavigate } from "react-router-dom"

type CommentsProps = {
  currentUser: IUser
  photo: IPhoto
  isCommentsDialogOpen: boolean
  setIsCommentsDialogOpen: (open: boolean) => void
  onCommentsUpdated?: (count: number) => void
}

const Comments = ({
  currentUser,
  photo,
  isCommentsDialogOpen,
  setIsCommentsDialogOpen,
  onCommentsUpdated,
}: CommentsProps) => {
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState<IComment[]>(photo.comments)
  const [replyingToComment, setReplyingToComment] = useState<IComment | null>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const commentInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setComments(photo.comments)
  }, [photo.comments])

  const handleComment = async () => {
    const trimmedComment = newComment.trim()
    if (!trimmedComment) return

    try {
      let updatedPhoto: IPhoto

      if (replyingToComment) {
        updatedPhoto = await photoService.addReply<IPhoto>(photo.id, replyingToComment.comment_id, trimmedComment)
      } else {
        updatedPhoto = await photoService.addComment<IPhoto>(photo.id, trimmedComment)
      }

      setComments(updatedPhoto.comments)
      onCommentsUpdated?.(updatedPhoto.comments.length)
      setNewComment("")
      setReplyingToComment(null)
    } catch (error) {
      console.error("Failed to add comment", error)
    }
  }

  const focusCommentInput = () => {
    commentInputRef.current?.focus()
  }

  const handleReplyClick = (comment: IComment) => {
    setReplyingToComment(comment)
    focusCommentInput()
    setNewComment(`@${comment.user_summary.username} `)
  }

  return (
    <>
      {isMobile ? (
        <Drawer open={isCommentsDialogOpen} onOpenChange={setIsCommentsDialogOpen} direction="bottom">
          <DrawerContent className="w-screen! h-screen max-w-none rounded-none">
            <div className="w-full flex justify-center items-center">
              <DrawerTitle className="my-5 text-sm">Comments</DrawerTitle>
              <DrawerDescription className="sr-only">
                Comments for {photo.user_summary.username}'s photo
              </DrawerDescription>
            </div>

            <Separator className="mb-2" />

            <div className="overflow-y-auto flex-1 px-6 space-y-2">
              {comments.map((comment) => {
                return (
                  <div key={comment.comment_id}>
                    <Comment
                      comment={comment}
                      isActive={replyingToComment?.comment_id === comment.comment_id}
                      onReplyClick={() => handleReplyClick(comment)}
                    />
                    {comment.replies.length > 0 &&
                      comment.replies.map((reply) => (
                        <Comment
                          key={reply.comment_id}
                          comment={reply}
                          isActive={replyingToComment?.comment_id === reply.comment_id}
                          onReplyClick={() => handleReplyClick(reply)}
                          className="pl-16"
                        />
                      ))}
                  </div>
                )
              })}
            </div>

            <Separator className="mb-2" />

            <div className="flex flex-row items-end gap-2 px-6 py-4">
              <Avatar className="mb-1">
                <AvatarImage src={currentUser?.profile_picture.url} />
              </Avatar>
              <div className="relative w-full">
                {replyingToComment && (
                  <div
                    className="text-xs text-muted-foreground flex flex-row items-center justify-start gap-1 mb-2"
                    onClick={() => {
                      setReplyingToComment(null)
                      setNewComment("")
                    }}
                  >
                    <XIcon className="size-4 cursor-pointer" />
                    Replying to {replyingToComment.user_summary.username}
                  </div>
                )}
                <Input
                  ref={commentInputRef}
                  name="comment-input"
                  className="w-full text-sm pr-10 h-10"
                  type="text"
                  placeholder="Add a comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                {newComment.trim().length > 0 && (
                  <Button className="absolute right-1 bottom-1" onClick={handleComment}>
                    <Send className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isCommentsDialogOpen} onOpenChange={setIsCommentsDialogOpen}>
          <DialogContent className="sm:max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="w-full flex justify-center items-center">
              <DialogTitle className="my-5 text-sm">Comments</DialogTitle>
              <DialogDescription className="sr-only">
                Comments for {photo.user_summary.username}'s photo
              </DialogDescription>
            </div>

            <Separator className="mb-2" />

            <div className="overflow-y-auto flex-1 px-6 space-y-2">
              {comments.map((comment) => {
                return (
                  <div key={comment.comment_id}>
                    <Comment
                      comment={comment}
                      isActive={replyingToComment?.comment_id === comment.comment_id}
                      onReplyClick={() => handleReplyClick(comment)}
                    />
                    {comment.replies.length > 0 &&
                      comment.replies.map((reply) => (
                        <Comment
                          key={reply.comment_id}
                          comment={reply}
                          isActive={replyingToComment?.comment_id === reply.comment_id}
                          onReplyClick={() => handleReplyClick(reply)}
                          className="pl-16"
                        />
                      ))}
                  </div>
                )
              })}
            </div>

            <Separator className="mb-2" />

            <div className="flex flex-row items-end gap-2 px-6 py-4">
              <Avatar className="mb-1">
                <AvatarImage src={currentUser?.profile_picture.url} />
              </Avatar>
              <div className="relative w-full">
                {replyingToComment && (
                  <div
                    className="text-xs text-muted-foreground flex flex-row items-center justify-start gap-1 mb-2"
                    onClick={() => {
                      setReplyingToComment(null)
                      setNewComment("")
                    }}
                  >
                    <XIcon className="size-4 cursor-pointer" />
                    Replying to {replyingToComment.user_summary.username}
                  </div>
                )}
                <Input
                  ref={commentInputRef}
                  name="comment-input"
                  className="w-full text-sm pr-10 h-10"
                  type="text"
                  placeholder="Add a comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                {newComment.trim().length > 0 && (
                  <Button className="absolute right-1 bottom-1" onClick={handleComment}>
                    <Send className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default Comments

type CommentProps = {
  comment: IComment
  isActive: boolean
  onReplyClick?: (commentId: string) => void
  className?: string
}

const Comment = ({ comment, isActive, onReplyClick, className }: CommentProps) => {
  const navigate = useNavigate()

  const handleUserClick = () => {
    navigate(`/${comment.user_summary.username}`)
    window.location.reload()
  }

  const handleReplyClick = () => {
    onReplyClick?.(comment.comment_id)
  }

  return (
    <div className={`flex flex-row gap-2 -mx-6 px-6 py-2 ${isActive ? "bg-secondary" : ""} ${className}`}>
      <Avatar className="mt-1 me-1" onClick={handleUserClick}>
        <AvatarImage src={comment.user_summary.profile_picture.url} />
      </Avatar>
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-1">
          <span className="cursor-pointer" onClick={handleUserClick}>
            {comment.user_summary.username}
          </span>
          <span className="text-xs text-muted-foreground">{formatDate(comment.comment_date)}</span>
        </div>
        {comment.content}
        <span className="text-muted-foreground cursor-pointer" onClick={handleReplyClick}>
          Reply
        </span>
      </div>
    </div>
  )
}
