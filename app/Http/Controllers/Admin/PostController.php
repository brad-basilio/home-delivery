<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Jobs\SendPostEmailsJob;
use App\Models\Post;
use App\Models\PostTag;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Ramsey\Uuid\Uuid;

class PostController extends BasicController
{
    public $model = Post::class;
    public $reactView = 'Admin/Posts';

    public $imageFields = ['image'];

    public function setPaginationInstance(string $model)
    {
        return $model::with(['category', 'tags']);
    }

  public function afterSave(Request $request, object $jpa, ?bool $isNew)
    {
       /* $tags = \explode(',', $request->tags ?? '');

        DB::transaction(function () use ($jpa, $tags) {
            // Eliminar tags que ya no están asociados
            PostTag::where('post_id', $jpa->id)->whereNotIn('tag_id', $tags)->delete();

            foreach ($tags as $tag) {
                if (Uuid::isValid($tag)) {
                    // Es un UUID existente
                    $tagId = $tag;
                } else {
                    // Es un nuevo tag
                    $tagJpa = Tag::firstOrCreate(
                        ['name' => $tag, 'tag_type' => 'post'],
                        ['tag_type' => 'post']
                    );
                    $tagId = $tagJpa->id;
                }

                PostTag::updateOrCreate([
                    'post_id' => $jpa->id,
                    'tag_id' => $tagId
                ]);
            }
        });*/

        // Notificar a los suscriptores si es nuevo blog (usando colas)
        //Crear un jobs
        if ($isNew) {
           SendPostEmailsJob::dispatchAfterResponse(
                $jpa
            );

        }
    }
}
