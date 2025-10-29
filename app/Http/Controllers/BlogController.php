<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\General;
use App\Models\Social;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Post;
use App\Models\LandingHome;

class BlogController extends PublicController
{
    public $reactView = 'Blog';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {
        $langId = app('current_lang_id');
        $categories = Category::select([
            DB::raw('DISTINCT(categories.id)'),
            'categories.name'
        ])
            ->join('posts', 'posts.category_id', 'categories.id')
            ->where('categories.visible', true)
            ->where('posts.lang_id', $langId)
            ->where('categories.status', true)
            ->get();
        $postRecent = Post::where('status', true)->orderBy('created_at', 'desc')->with('category')->where('lang_id', $langId)->limit(3)->get();
        $landing = LandingHome::where('correlative', 'like', 'page_blog%')->where('lang_id', $langId)->get();
        
        // Agregar generals y socials para Header y Footer
        $generals = General::all();
        $socials = Social::where('status', true)->get();
        
        return [
            'categories' => $categories,
            'postRecent' => $postRecent,
            'landing' => $landing,
            'generals' => $generals,
            'socials' => $socials
        ];
    }
}
