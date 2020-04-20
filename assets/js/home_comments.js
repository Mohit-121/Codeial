{
    // Method to Submit the form data for new Comment using Ajax
    let createComment = function(){
        let newCommentForm = $('.new-comment-form').each(function(){
            let form=$(this);
            form.submit(function(e){
                e.preventDefault();
                $.ajax({
                    type: 'post',
                    url: '/comments/create',
                    data: form.serialize(),
                    success: function(data){
                        let newComment = newCommentDom(data.data.comment);
                        let form_parent=$(form).parent()[0];
                        $(' .post-comments-list>ul',form_parent).prepend(newComment);
                        notifications('success',data.message);
                        deletePost($(' .delete-comment-button',newComment));
                    },error: function(err){
                        notifications('error',err.responseText);
                    }
                });
            });
        });
    }


    // Method to create Comments in DOM
    let newCommentDom = function(comment){
        return $(`<li id="comment-${ comment._id }">
                    <p>
                        <small>
                            <a class="delete-comment-button" href="/comments/destroy/${ comment._id }">X</a>
                        </small>
                        ${ comment.content }
                        <br>
                        <small>
                            ${ comment.user.name }
                        </small>
                    </p>
                </li>`);
    }

    // Method to delete a Post from DOM
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#comment-${ data.data.comment._id}`).remove();
                    notifications('success',data.message);
                },error: function(err){
                    console.log(err.responseText);
                }
            });
        });
    }

    // Delete any other comments when clicked on delete button
    $('.post-comments .post-comments-list>ul li').each(function(){
        deletePost($(' .delete-comment-button',$(this)));
    });

  // Method to call Noty Notifications
    let notifications = function(type,text){
        new Noty({
            theme: 'relax',
            text: text,
            type: type,
            layout: 'topRight',
            timeout: 1000
        }).show();
    }

    // Call Create Post
    createComment();
}