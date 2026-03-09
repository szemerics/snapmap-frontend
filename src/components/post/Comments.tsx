import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog"
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "../ui/drawer"
import { useMediaQuery } from "@/hooks/use-media-query"
import type { IComment, IPhoto } from "@/interfaces/IPhoto"
import { Avatar, AvatarImage } from "../ui/avatar"
import { formatDate } from "./helpers"
import { Separator } from "../ui/separator"
import { photoService } from "@/services/photo.service"
import type { IUser } from "@/interfaces/IUser"
import { useNavigate } from "react-router-dom"
import CommentInputSection from "./CommentInputSection"

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

  const renderReplies = (parentComment: IComment) => {
    const replies: React.ReactNode[] = []

    const collectReplies = (comment: IComment) => {
      comment.replies.forEach((reply) => {
        replies.push(
          <Comment
            key={reply.comment_id}
            comment={reply}
            isActive={replyingToComment?.comment_id === reply.comment_id}
            onReplyClick={() => handleReplyClick(reply)}
            className="pl-16"
          />
        )

        if (reply.replies.length > 0) {
          collectReplies(reply)
        }
      })
    }

    collectReplies(parentComment)

    return replies
  }

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
      const replyCount = updatedPhoto.comments.reduce((total, comment) => total + comment.replies.length, 0)
      onCommentsUpdated?.(updatedPhoto.comments.length + replyCount)
      setNewComment("")
      setReplyingToComment(null)
    } catch (error) {
      console.error("Failed to add comment", error)
    }
  }

  const handleReplyClick = (comment: IComment) => {
    setReplyingToComment(comment)
    commentInputRef.current?.focus()
    setNewComment(`@${comment.user_summary.username} `)
  }

  useEffect(() => {
    setComments(photo.comments)
  }, [photo.comments])

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
                      onReplyClick={handleReplyClick}
                    />
                    {comment.replies.length > 0 && renderReplies(comment)}
                  </div>
                )
              })}
            </div>

            <Separator className="mb-2" />

            <CommentInputSection
              currentUser={currentUser}
              replyingToComment={replyingToComment}
              newComment={newComment}
              onChangeComment={setNewComment}
              onClearReply={() => {
                setReplyingToComment(null)
                setNewComment("")
              }}
              onSubmit={handleComment}
              inputRef={commentInputRef}
            />
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
                      onReplyClick={handleReplyClick}
                    />
                    {comment.replies.length > 0 && renderReplies(comment)}
                  </div>
                )
              })}
            </div>

            <Separator className="mb-2" />

            <CommentInputSection
              currentUser={currentUser}
              replyingToComment={replyingToComment}
              newComment={newComment}
              onChangeComment={setNewComment}
              onClearReply={() => {
                setReplyingToComment(null)
                setNewComment("")
              }}
              onSubmit={handleComment}
              inputRef={commentInputRef}
            />
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
  onReplyClick?: (comment: IComment) => void
  className?: string
}

const Comment = ({ comment, isActive, onReplyClick, className }: CommentProps) => {
  const navigate = useNavigate()

  const handleUserClick = () => {
    navigate(`/${comment.user_summary.username}`)
    window.location.reload()
  }

  const handleReplyClick = () => {
    onReplyClick?.(comment)
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
