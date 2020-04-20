{
    // Method to Submit the form data for new Post using Ajax
    let createPost = function(){
        let newPostForm = $('#new-post-form');
        newPostForm.submit(function(e){
            e.preventDefault();
            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data){
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button',newPost));
                    notifications('success',data.message);
                },error: function(err){
                    notifications('error',err.responseText);
                }
            });
        });
    }
    // Method to create Post in DOM
    let newPostDom = function(post){
        return $(`<li id="post-${post._id}">
                    <p>
                        <small>
                            <a class="delete-post-button" href="/posts/destroy/${post._id }">X</a>
                        </small>
                        ${ post.content }
                        <br>
                        <small> ${ post.user.name } </small>
                    </p>
                    <div class="post-comments">
                            <form action="/comments/create" method="POST">
                                <input type="text" name="content" placeholder="Type here to add comment..." required>
                                <input type="hidden" name="post" value="${ post._id }">
                                <input type="submit" value="Add Comment">
                            </form>
                
                        <div class="post-comments-list">
                            <ul id="post-comments-${ post._id }">
                              
                            </ul>
                        </div>
                    </div>
                </li>`)
    }

    // Method to delete a Post from DOM
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();
                    notifications('success',data.message);
                },error: function(err){
                    notifications('error',err.responseText);
                }
            });
        });
    }

    // Method to loop over previously created Post and call DeletePost on it
    $('#posts-list-container>ul li').each(function(){
        deletePost($(' .delete-post-button',$(this)));
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
    createPost();
}