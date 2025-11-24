<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Category;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use SoDe\Extend\File;
use SoDe\Extend\JSON;

class ItemController extends BasicController
{
    public $model = Item::class;
    public $reactView = 'Admin/Items';
    public $imageFields = ['image'];
    public $prefix4filter = 'items';

    public function setReactViewProperties(Request $request)
    {
        $categories = Category::all();

        return [
            'categories' => $categories,

        ];
    }

    public function setPaginationInstance(string $model)
    {
        return $model::select(['items.*'])
            ->with(['category', 'images'])
            ->leftJoin('categories AS category', 'category.id', 'items.category_id');
    }

    public function afterSave(Request $request, object $jpa, ?bool $isNew)
    {
        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $file) {
                if (!$file) continue;
                $imageRequest = new Request();
                $imageRequest->replace(['item_id' => $jpa->id]);
                $imageRequest->files->set('url', $file);
                (new ItemImageController())->save($imageRequest);
            }
        }
    }
}
