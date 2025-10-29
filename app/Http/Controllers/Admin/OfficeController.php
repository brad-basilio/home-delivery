<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Office;
use Illuminate\Http\Request;

class OfficeController extends BasicController
{
    public $model = Office::class;
    public $reactView = 'Offices';
    public $reactRootView = 'admin';
    public $imageFields = ['image'];

    public function setReactViewProperties(Request $request)
    {
        return [];
    }
}
