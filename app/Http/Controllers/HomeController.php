<?php

namespace App\Http\Controllers;

use App\Models\Aboutus;
use App\Models\Ad;
use App\Models\Faq;
use App\Models\General;
use App\Models\Indicator;
use App\Models\InstagramPost;
use App\Models\Item;
use App\Models\LandingHome;
use App\Models\Lang;
use App\Models\Post;
use App\Models\Service;
use App\Models\Slider;
use App\Models\Social;
use App\Models\Staff;
use App\Models\Strength;
use App\Models\Supply;
use App\Models\Testimony;
use Illuminate\Http\Request;

class HomeController extends BasicController
{
    public $reactView = 'Home';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {

        $langId = app('current_lang_id');

        /*ESTO ES PARA NO PAIN */

        $indicators = Indicator::where('status', true)->where('visible', true)->where('lang_id', $langId)->get();
        $landing = LandingHome::where('correlative', 'like', 'page_home%')->where('lang_id', $langId)->get();
        $benefits = Strength::where('status', true)->where('visible', true)->where('lang_id', $langId)->get();
        $services = Service::where('visible', true)->where('status', true)->where('lang_id', $langId)->orderBy('created_at', 'ASC')->get();
        $testimonies = Testimony::where('status', true)->where('visible', true)->where('lang_id', $langId)->get();
        $staff_boss = Staff::where('status', true)->where('visible', true)->where('job', 'LIKE', 'Director%')->where('lang_id', $langId)->first();
        $faqs = Faq::where('status', true)->where('visible', true)->where('lang_id', $langId)->get();
        $generlas = General::where('lang_id', $langId)->get();
        $socials = Social::where('status', true)->where('visible', true)->get();
        $sliders = Slider::where('status', true)->where('visible', true)->get();
        return [

            'indicators' => $indicators,
            'landing' => $landing,
            'benefits' => $benefits,
            'services' => $services,
            'testimonies' => $testimonies,
            'staff_boss' => $staff_boss,
            'faqs' => $faqs,
            'generals' => $generlas,
            'socials' => $socials,
            'sliders' => $sliders,
            // 'languagesSystem' => Lang::where('status', true)->where('visible', true)->get(),
        ];
    }
}
