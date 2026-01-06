<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Alliance;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AllianceController extends BasicController
{
    public $model = Alliance::class;
    public $reactView = 'Admin/Alliances';
    public $imageFields = ['image'];

    public function setReactViewProperties(Request $request)
    {
        return [];
    }

   
}
