/*!
 * Lunr languages, `Farsi` language
 * https://github.com/MihaiValentin/lunr-languages
 *
 * Copyright 2014, Mihai Valentin
 * http://www.mozilla.org/MPL/
 */
/*!
 * based on
 * Snowball JavaScript Library v0.3
 * http://code.google.com/p/urim/
 * http://snowball.tartarus.org/
 *
 * Copyright 2010, Oleg Mazko
 * http://www.mozilla.org/MPL/
 */

/**
 * export the module via AMD, CommonJS or as a browser global
 * Export code from https://github.com/umdjs/umd/blob/master/returnExports.js
 */
;
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory)
  } else if (typeof exports === 'object') {
    /**
     * Node. Does not work with strict CommonJS, but
     * only CommonJS-like environments that support module.exports,
     * like Node.
     */
    module.exports = factory()
  } else {
    // Browser globals (root is window)
    factory()(root.lunr);
  }
}(this, function() {
  /**
   * Just return a value to define the module export.
   * This example returns an object, but the module
   * can return a function as the exported value.
   */
  return function(lunr) {
    /* throw error if lunr is not yet included */
    if ('undefined' === typeof lunr) {
      throw new Error('Lunr is not present. Please include / require Lunr before this script.');
    }

    /* throw error if lunr stemmer support is not yet included */
    if ('undefined' === typeof lunr.stemmerSupport) {
      throw new Error('Lunr stemmer support is not present. Please include / require Lunr stemmer support before this script.');
    }

    /* register specific locale function */
    lunr.fa = function() {
      this.pipeline.reset();
      this.pipeline.add(
        lunr.fa.trimmer,
        lunr.fa.stopWordFilter,
        lunr.fa.stemmer
      );


      // for lunr version 2
      // this is necessary so that every searched word is also stemmed before
      // in lunr <= 1 this is not needed, as it is done using the normal pipeline
      if (this.searchPipeline) {
        this.searchPipeline.reset();
        this.searchPipeline.add(lunr.fa.stemmer)
      }
    };

    /* lunr trimmer function */
    lunr.fa.wordCharacters = "\u0621-\u065b\u0671\u0640";
    lunr.fa.trimmer = lunr.trimmerSupport.generateTrimmer(lunr.fa.wordCharacters);

    lunr.Pipeline.registerFunction(lunr.fa.trimmer, 'trimmer-fa');

    /* lunr stemmer function */
    lunr.fa.stemmer = (function() {
      var self = this;
      var word = '';
      self.result = false;
      self.preRemoved = false;
      self.sufRemoved = false;

      //suffix data
      self.suf = {
        suf1: 'م ت ش ی',
        suf2: 'یم یت یش ام ات اش ها تر ان ای یی ها',
        suf3: 'انی انم انت انش های های مان تان شان',
        suf4: 'یمان یتان یشان هایی ‌هایم ‌هایت ‌هایش هایی هایم هاست ‌هاست هایت هایش ترین',
        suf5: 'هایمان هایتان هایشان ‌هایمان هایتان ‌هایشان'
      }

      //arabic language patterns and alternative mapping for patterns
      self.patterns = JSON.parse('{"pt43":[{"pt":[{"c":"ا","l":1}]},{"pt":[{"c":"ا,ت,ن,ي","l":0}],"mPt":[{"c":"ف","l":0,"m":1},{"c":"ع","l":1,"m":2},{"c":"ل","l":2,"m":3}]},{"pt":[{"c":"و","l":2}],"mPt":[{"c":"ف","l":0,"m":0},{"c":"ع","l":1,"m":1},{"c":"ل","l":2,"m":3}]},{"pt":[{"c":"ا","l":2}]},{"pt":[{"c":"ي","l":2}],"mPt":[{"c":"ف","l":0,"m":0},{"c":"ع","l":1,"m":1},{"c":"ا","l":2},{"c":"ل","l":3,"m":3}]},{"pt":[{"c":"م","l":0}]}],"pt53":[{"pt":[{"c":"ت","l":0},{"c":"ا","l":2}]},{"pt":[{"c":"ا,ن,ت,ي","l":0},{"c":"ت","l":2}],"mPt":[{"c":"ا","l":0},{"c":"ف","l":1,"m":1},{"c":"ت","l":2},{"c":"ع","l":3,"m":3},{"c":"ا","l":4},{"c":"ل","l":5,"m":4}]},{"pt":[{"c":"ا","l":0},{"c":"ا","l":2}],"mPt":[{"c":"ا","l":0},{"c":"ف","l":1,"m":1},{"c":"ع","l":2,"m":3},{"c":"ل","l":3,"m":4},{"c":"ا","l":4},{"c":"ل","l":5,"m":4}]},{"pt":[{"c":"ا","l":0},{"c":"ا","l":3}],"mPt":[{"c":"ف","l":0,"m":1},{"c":"ع","l":1,"m":2},{"c":"ل","l":2,"m":4}]},{"pt":[{"c":"ا","l":3},{"c":"ن","l":4}]},{"pt":[{"c":"ت","l":0},{"c":"ي","l":3}]},{"pt":[{"c":"م","l":0},{"c":"و","l":3}]},{"pt":[{"c":"ا","l":1},{"c":"و","l":3}]},{"pt":[{"c":"و","l":1},{"c":"ا","l":2}]},{"pt":[{"c":"م","l":0},{"c":"ا","l":3}]},{"pt":[{"c":"م","l":0},{"c":"ي","l":3}]},{"pt":[{"c":"ا","l":2},{"c":"ن","l":3}]},{"pt":[{"c":"م","l":0},{"c":"ن","l":1}],"mPt":[{"c":"ا","l":0},{"c":"ن","l":1},{"c":"ف","l":2,"m":2},{"c":"ع","l":3,"m":3},{"c":"ا","l":4},{"c":"ل","l":5,"m":4}]},{"pt":[{"c":"م","l":0},{"c":"ت","l":2}],"mPt":[{"c":"ا","l":0},{"c":"ف","l":1,"m":1},{"c":"ت","l":2},{"c":"ع","l":3,"m":3},{"c":"ا","l":4},{"c":"ل","l":5,"m":4}]},{"pt":[{"c":"م","l":0},{"c":"ا","l":2}]},{"pt":[{"c":"م","l":1},{"c":"ا","l":3}]},{"pt":[{"c":"ي,ت,ا,ن","l":0},{"c":"ت","l":1}],"mPt":[{"c":"ف","l":0,"m":2},{"c":"ع","l":1,"m":3},{"c":"ا","l":2},{"c":"ل","l":3,"m":4}]},{"pt":[{"c":"ت,ي,ا,ن","l":0},{"c":"ت","l":2}],"mPt":[{"c":"ا","l":0},{"c":"ف","l":1,"m":1},{"c":"ت","l":2},{"c":"ع","l":3,"m":3},{"c":"ا","l":4},{"c":"ل","l":5,"m":4}]},{"pt":[{"c":"ا","l":2},{"c":"ي","l":3}]},{"pt":[{"c":"ا,ي,ت,ن","l":0},{"c":"ن","l":1}],"mPt":[{"c":"ا","l":0},{"c":"ن","l":1},{"c":"ف","l":2,"m":2},{"c":"ع","l":3,"m":3},{"c":"ا","l":4},{"c":"ل","l":5,"m":4}]},{"pt":[{"c":"ا","l":3},{"c":"ء","l":4}]}],"pt63":[{"pt":[{"c":"ا","l":0},{"c":"ت","l":2},{"c":"ا","l":4}]},{"pt":[{"c":"ا,ت,ن,ي","l":0},{"c":"س","l":1},{"c":"ت","l":2}],"mPt":[{"c":"ا","l":0},{"c":"س","l":1},{"c":"ت","l":2},{"c":"ف","l":3,"m":3},{"c":"ع","l":4,"m":4},{"c":"ا","l":5},{"c":"ل","l":6,"m":5}]},{"pt":[{"c":"ا,ن,ت,ي","l":0},{"c":"و","l":3}]},{"pt":[{"c":"م","l":0},{"c":"س","l":1},{"c":"ت","l":2}],"mPt":[{"c":"ا","l":0},{"c":"س","l":1},{"c":"ت","l":2},{"c":"ف","l":3,"m":3},{"c":"ع","l":4,"m":4},{"c":"ا","l":5},{"c":"ل","l":6,"m":5}]},{"pt":[{"c":"ي","l":1},{"c":"ي","l":3},{"c":"ا","l":4},{"c":"ء","l":5}]},{"pt":[{"c":"ا","l":0},{"c":"ن","l":1},{"c":"ا","l":4}]}],"pt54":[{"pt":[{"c":"ت","l":0}]},{"pt":[{"c":"ا,ي,ت,ن","l":0}],"mPt":[{"c":"ا","l":0},{"c":"ف","l":1,"m":1},{"c":"ع","l":2,"m":2},{"c":"ل","l":3,"m":3},{"c":"ر","l":4,"m":4},{"c":"ا","l":5},{"c":"ر","l":6,"m":4}]},{"pt":[{"c":"م","l":0}],"mPt":[{"c":"ا","l":0},{"c":"ف","l":1,"m":1},{"c":"ع","l":2,"m":2},{"c":"ل","l":3,"m":3},{"c":"ر","l":4,"m":4},{"c":"ا","l":5},{"c":"ر","l":6,"m":4}]},{"pt":[{"c":"ا","l":2}]},{"pt":[{"c":"ا","l":0},{"c":"ن","l":2}]}],"pt64":[{"pt":[{"c":"ا","l":0},{"c":"ا","l":4}]},{"pt":[{"c":"م","l":0},{"c":"ت","l":1}]}],"pt73":[{"pt":[{"c":"ا","l":0},{"c":"س","l":1},{"c":"ت","l":2},{"c":"ا","l":5}]}],"pt75":[{"pt":[{"c":"ا","l":0},{"c":"ا","l":5}]}]}');

      self.execArray = [
        'removeDiacritics',
        'cleanAlef',
        'removeStopWords',
        'normalizeYeh',
        'normalizeEndHamzeh',
        'wordCheck',
        'wordCheckWitouttRemoveSuf'
      ];

      self.stem = function() {
        var counter = 0;
        self.result = false;
        self.preRemoved = false;
        self.sufRemoved = false;
        while (counter < self.execArray.length && self.result != true) {
          self.result = self[self.execArray[counter]]();
          counter++;
        }
      }

      self.setCurrent = function(word) {
        self.word = word;
      }

      self.getCurrent = function() {
        return self.word
      }

      /*Remove Hamze, Tashdid, Fatheh, Tanvin ... */
      self.removeDiacritics = function() {
        var diacriticsRegex = RegExp("[\u0621\u0654\u0655\u0618\u0619\u061A\u0651\u0650\u064B\u064C\u064D\u064E\u064F]");
        self.word = self.word.replace(diacriticsRegex, '');
        return false;
      }

      /*Replace all variations of alef (آأإٱ)to a plain alef (ا)*/
      self.cleanAlef = function() {
        var alefRegex = new RegExp("[\u0622\u0623\u0625\u0671]");
        self.word = self.word.replace(alefRegex, "\u0627");
        return false;
      }

      /* if the word is a stop word, don't stem*/
      self.removeStopWords = function() {
        var stopWords = '۰ ۱ ۲ ۳ ۴ ۵ ۶ ۷ ۸ ۹ " «  » . , ، # - _ ؟ ؛ , آخ آخر آخرها آخه آدمهاست آرام آرام آره آری آسیب پذیرند آشنایند آشکارا آقا آقای آقایان آمد آمدن آمده آمرانه آن آن گاه آنان آنانی آنجا آنرا آنطور آنقدر آنها آنهاست آنچنان آنچنان که آنچه آنکه آنگاه آن‌ها آهان آهای آور آورد آوردن آورده آوه آی آیا آید آیند ا اتفاقا اثرِ اجراست احتراما احتمالا احیاناً اخیر اخیراً اری از از آن پس از جمله ازاین رو ازجمله ازش اساسا اساساً است استفاد استفاده اسلامی اند اش اشکارا اصلا اصلاً اصولا اصولاً اعلام اغلب افزود افسوس اقل اقلیت الا الان البته البتّه الهی الی ام اما امروز امروزه امسال امشب امور امیدوارم امیدوارند امیدواریم ان ان شاأالله انتها انجام اند انشاالله انصافا انطور انقدر انها انچنان انکه انگار او اوست اول اولا اولاً اولین اون اکثر اکثرا اکثراً اکثریت اکنون اگر اگر چه اگرچه اگه ای ایا اید ایشان ایم این این جوری این قدر این گونه اینان اینجا اینجاست ایند اینطور اینقدر اینها اینهاست اینو اینچنین اینک اینکه اینکه اینگونه ب با بااین حال بااین وجود باد بار بارة باره بارها باز باز هم بازهم بازی کنان بازیگوشانه باش باشد باشم باشند باشی باشید باشیم بالا بالاخره بالاخص بالاست بالای بالایِ بالطبع بالعکس باوجودی که باورند باید بتدریج بتوان بتواند بتوانی بتوانیم بجز بخش بخشه بخشی بخصوص بخواه بخواهد بخواهم بخواهند بخواهی بخواهید بخواهیم بدان بدانجا بدانها بدهید بدون بدین بدین ترتیب بدینجا بر برآنند برا برابر برابرِ براحتی براساس براستی برای برایت برایش برایشان برایم برایمان برایِ برخی برداری برعکس برنامه سازهاست بروز بروشنی بزودی بس بسا بسادگی بسختی بسوی بسی بسیاری بطور بطوری که بعد بعد از این که بعدا بعدازظهر بعداً بعدها بعری بعضا بعضی بعضی شان بعضیهایشان بعضی‌ها بعلاوه بفهمی نفهمی بلافاصله بله بلکه بلی بماند بنابراین بندی به به تازگی به جای به جز به درشتی به دلخواه به راستی به رغم به روشنی به زودی به شان به طور کلی به طوری که به علاوه به قدری به مراتب به ناچار به هرحال به وضوح به کرات به گرمی بهت بهش بود بودم بودن بودند بوده بودی بودید بودیم بپا بکار بکن بکند بکنم بکنند بکنی بکنید بکنیم بگذاریم بگو بگوید بگویم بگویند بگویی بگویید بگوییم بگیر بگیرد بگیرم بگیرند بگیری بگیرید بگیریم بی بی آنکه بی تفاوتند بی نیازمندانه بی هدف بیا بیاب بیابد بیابم بیابند بیابی بیابید بیابیم بیاور بیاورد بیاورم بیاورند بیاوری بیاورید بیاوریم بیاید بیایم بیایند بیایی بیایید بیاییم بیرون بیرونِ بیش بیشتر بیشتری بین بیگمان ت تا تازه تان تاکنون تحت تحریم هاست تر تر براساس تریلیارد تریلیون ترین تصریحاً تعدادی تعمدا تقریبا تقریباً تلویحا تلویحاً تمام تمام قد تماما تمامشان تمامی تند تند تنها تو توؤماً توان تواند توانست توانستم توانستن توانستند توانسته توانستی توانستیم توانم توانند توانی توانید توانیم توسط تولِ توی تویِ تک تک ث ثالثاً ثانیا ثانیاً ج جا جای جایی جدا جداً جداگانه جدید جدیدا جرمزاست جریان جز جلو جلوگیری جلوی جلویِ جمع اند جمعا جمعی جنابعالی جناح جنس اند جهت جور ح حاشیه‌ای حاضر حاضرم حال حالا حاکیست حتما حتماً حتی حداقل حداکثر حدود حدودا حدودِ حسابگرانه حضرتعالی حق حقیرانه حقیقتا حول حکماً خ خارجِ خالصانه خب خداحافظ خداست خدمات خسته‌ای خصوصا خصوصاً خلاصه خواست خواستم خواستن خواستند خواسته خواستی خواستید خواستیم خواه خواهد خواهم خواهند خواهی خواهید خواهیم خود خود به خود خودبه خودی خودت خودتان خودتو خودش خودشان خودم خودمان خودمو خویش خویشتن خویشتنم خیاه خیر خیره خیلی د دا داام دااما داخل داد دادم دادن دادند داده دادی دادید دادیم دار دارد دارم دارند داری دارید داریم داشت داشتم داشتن داشتند داشته داشتی داشتید داشتیم دامم دانست دانند دایم دایما در در باره در بارهٌ در ثانی در مجموع در نهایت در واقع در کل در کنار دراین میان درباره درحالی که درحالیکه درست درسته درصورتی که درعین حال درمجموع درواقع درون دریغ دریغا درین دسته دسته دشمنیم دقیقا دم دنبالِ ده دهد دهم دهند دهی دهید دهیم دو دو روزه دوباره دوم دیده دیر دیرت دیرم دیروز دیشب دیوانه‌ای دیوی دیگر دیگران دیگری دیگه ذ ذاتاً ر را راجع به راسا راست راستی راه رسما رسید رسیده رشته رفت رفتارهاست رفته رنجند رهگشاست رو رواست روب روبروست روز روز به روز روزانه روزه ایم روزه ست روزه م روزهای روزه‌ای روش روی رویش رویِ ریزی ز زشتکارانند زمان زمانی زمینه زنند زهی زود زودتر زیر زیرا زیرِ زیرچشمی س سابق ساخته سازی سالانه سالته سالم‌تر سالهاست سالیانه ساکنند سایر سخت سخته سر سراسر سرانجام سراپا سری سریعا سریعاً سریِ سعی سمتِ سه باره سهواً سوم سوی سویِ سپس سیاه چاله هاست سیخ ش شان شاهدند شاهدیم شاید شبهاست شخصا شخصاً شد شدم شدن شدند شده شدی شدید شدیدا شدیداً شدیم شش شش نداشته شما شماری شماست شمایند شناسی شو شود شوراست شوقم شوم شوند شونده شوی شوید شویم شیرین شیرینه شیک ص صد صددرصد صرفا صرفاً صریحاً صندوق هاست صورت ض ضدِّ ضدِّ ضمن ضمناً ط طبعا طبعاً طبقِ طبیعتا طرف طریق طلبکارانه طور طی ظ ظاهرا ظاهراً ع عاجزانه عاقبت عبارتند عجب عدم عرفانی عقب عقبِ علاوه بر علاوه بر آن علاوه برآن علناً علّتِ علی الظاهر علیه عمدا عمداً عمدتا عمدتاً عمده عمل عملا عملاً عملی اند عموم عموما عموماً عنقریب عنوان عنوانِ عیناً غ غالبا غزالان غیر غیرقانونی ف فاقد فبها فر فردا فعلا فعلاً فقط فلان فلذا فوق فکر ق قاالند قابل قاطبه قاطعانه قاعدتاً قانوناً قبل قبلا قبلاً قبلند قدر قدری قصدِ قضایاست قطعا قطعاً ل لااقل لاجرم لب لذا لزوماً لطفا لطفاً لیکن م ما مادامی ماست مامان مامان گویان مان مانند مانندِ مبادا متعاقبا متفاوتند مثل مثلا مثلِ مجبورند مجددا مجدداً مجموعا مجموعاً محتاجند مخالفند مختلف مخصوصاً مدام مدت مدتهاست مدّتی مذهبی اند مرا مرتب مردانه مردم مردم اند مستحضرید مستقیما مستند مسلما مشت مشترکاً مشغولند مطمانا مطمانم مطمینا مع الاسف مع ذلک معتقدم معتقدند معتقدیم معدود معذوریم معلومه معمولا معمولاً معمولی مغرضانه مفیدند مقابل مقدار مقصرند مقصری ملیارد ملیون ممکن ممیزیهاست من منتهی منطقی منی مواجهند موارد موجودند مورد موقتا مکرر مکرراً مگر مگر آن که مگر این که مگو می میان میزان میلیارد میلیون میکند میکنم میکنند میکنی میکنید میکنیم می‌تواند می‌خواهیم می‌داند می‌رسد می‌رود می‌شود می‌کنم می‌کنند می‌کنیم ن ناخواسته ناراضی اند ناشی نام ناگاه ناگهان ناگهانی نباید نبش نبود نخست نخستین نخواهد نخواهم نخواهند نخواهی نخواهید نخواهیم نخودی ندارد ندارم ندارند نداری ندارید نداریم نداشت نداشتم نداشتند نداشته نداشتی نداشتید نداشتیم نزد نزدِ نزدیک نزدیکِ نسبتا نشان نشده نظیر نفرند نماید نموده نمی نمی‌شود نمی‌کند نه نه تنها نهایتا نهایتاً نوع نوعاً نوعی نکرده نکن نکند نکنم نکنند نکنی نکنید نکنیم نگاه نگو نیازمندند نیز نیست نیستم نیستند نیستیم نیمی ه ها های هایی هبچ هر هر از گاهی هر چند هر چند که هر چه هرچند هرچه هرکس هرگاه هرگز هزار هست هستم هستند هستی هستید هستیم هفت هق هق کنان هم هم اکنون هم اینک همان همان طور که همان گونه که همانا همانند همانها همدیگر همزمان همه همه روزه همه ساله همه شان همهٌ همه‌اش همواره همچنان همچنان که همچنین همچون همچین همگان همگی همیشه همین همین که هنوز هنگام هنگامِ هنگامی هنگامی که هوی هی هیچ هیچ گاه هیچکدام هیچکس هیچگاه هیچگونه هیچی و و لا غیر وابسته اند واقعا واقعاً واقعی واقفند واما وای وجود وحشت زده وسطِ وضع وقتی وقتی که وقتیکه ولی وگرنه وگو وی ویا ویژه پ پارسال پارسایانه پاره‌ای پاعینِ پایین ترند پدرانه پرسان پروردگارا پریروز پس پس از پس فردا پشت پشتوانه اند پنج پهن شده پی پی درپی پیدا پیداست پیرامون پیش پیشاپیش پیشتر پیشِ پیوسته چ چاپلوسانه چت چته چرا چرا که چشم بسته چطور چقدر چنان چنانچه چنانکه چند چند روزه چندان چنده چندین چنین چه چه بسا چه طور چهار چو چون چکار چگونه چی چیز چیزی چیزیست چیست چیه ژ ک کارند کاش کاشکی کامل کاملا کاملاً کتبا کجا کجاست کدام کرد کردم کردن کردند کرده کردی کردید کردیم کس کسانی کسی کل کلا کلی کلیه کم کم کم کما کماکان کمتر کمتره کمتری کمی کن کنار کنارش کنارِ کنایه‌ای کند کنم کنند کننده کنون کنونی کنی کنید کنیم که کو کَی کی گ گاه گاهی گذاری گذاشته گذشته گردد گردند گرفت گرفتارند گرفتم گرفتن گرفتند گرفته گرفتی گرفتید گرفتیم گروهی گرچه گفت گفتم گفتن گفتند گفته گفتی گفتید گفتیم گه گهگاه گو گونه گوی گویا گوید گویم گویند گویی گویید گوییم گیر گیرد گیرم گیرند گیری گیرید گیریم ی یا یاب یابد یابم یابند یابی یابید یابیم یارب یافت یافتم یافتن یافته یافتی یافتید یافتیم یعنی یقینا یقیناً یه یواش یواش یک یک جوری یک کم یک کمی یکدیگر یکریز یکسال یکهزار یکی '.split(' ');
        if (stopWords.indexOf(self.word) >= 0) {
          return true;
        }
      }

      /* changes  arabic ی to farsi ی and removes alef if at the end of the word*/
      self.normalizeYeh = function() {
        if (self.word.length > 2) {
          self.word = self.word.replace('\u064A', '\u06CC');
          return false;
        } else return false;
      }

      /*Chnage ة and ۀ to ه*/
      self.normalizeEndHamzeh = function() {
        if (self.word.length > 1) {
          self.word = self.word.replace('\u06C0', '\u0647');
          self.word = self.word.replace('\u0629', '\u0647');
          return false;
        } else return true;
      }

      /* check the word against word patterns. If the word matches a pattern, map it to the 
      alternative pattern if available then stop stemming. */
      self.patternCheck = function(pattern) {
        var patternMatch = false;
        for (var i = 0; i < pattern.length; i++) {
          var currentPatternCheck = true;
          for (var j = 0; j < pattern[i].pt.length; j++) {
            var chars = pattern[i].pt[j].c.split(',');
            var charMatch = false;
            chars.forEach(function(el) {
              if (self.word[pattern[i].pt[j].l] == el) {
                charMatch = true;
              }
            })
            if (!charMatch) {
              currentPatternCheck = false;
              break;
            }
          }
          if (currentPatternCheck == true) {
            if (pattern[i].mPt) {
              var newWord = [];
              for (var k = 0; k < pattern[i].mPt.length; k++) {
                if (pattern[i].mPt[k].m != null) {
                  newWord[pattern[i].mPt[k].l] = self.word[pattern[i].mPt[k].m]
                } else {
                  newWord[pattern[i].mPt[k].l] = pattern[i].mPt[k].c
                }
              }
              self.word = newWord.join('');
            }
            self.result = true;
            break;
          }
        }
      }

      /*remove suffixes of size 1 char */
      self.removeSuf1 = function() {
        var word = self.word;
        if (self.sufRemoved == false)
          if (self.word.length > 3) {
            var suf1Regex = new RegExp('(' + self.suf.suf1.split(' ').join('|') + ')$');
            self.word = self.word.replace(suf1Regex, '');
          }
        if (word != self.word) self.sufRemoved = true;
        return false;
      }

      /*remove suffixes of size 5, 4, 3 and 2 chars*/
      self.removeSuf5432 = function() {
        var word = self.word;
        if (self.word.length >= 7) {
          var suf5Regex = new RegExp('(' + self.suf.suf5.split(' ').join('|') + ')$');
          self.word = self.word.replace(suf5Regex, '');
        }
        if (self.word.length >= 6) {
          var suf4Regex = new RegExp('(' + self.suf.suf4.split(' ').join('|') + ')$');
          self.word = self.word.replace(suf4Regex, '');
        }
        if (self.word == word && self.word.length >= 5) {
          var suf3Regex = new RegExp('(' + self.suf.suf3.split(' ').join('|') + ')$');
          self.word = self.word.replace(suf3Regex, '');
        }
        if (self.word == word && self.word.length >= 4) {
          var suf2Regex = new RegExp('(' + self.suf.suf2.split(' ').join('|') + ')$');
          self.word = self.word.replace(suf2Regex, '');
        }
        if (word != self.word) self.sufRemoved = true;
        return false;
      }

      /*check the word length and decide what is the next step accordingly*/
      self.wordCheck = function() {
        var word = self.word;
        var word8Exec = [self.removeSuf5432, self.removeSuf1]
        var counter = 0;
        var patternChecked = false;
        while (self.word.length >= 8 && !self.result && counter < word8Exec.length) {
          if (self.word.length == 8 && !patternChecked) {
            self.checkPattern73();
            self.checkPattern75();
            patternChecked = true;
          } else {
            word8Exec[counter]();
            counter++;
            patternChecked = false;
          }
        }

        var word7Exec = [self.checkPattern73, self.removeSuf5432, self.removeSuf1, self.checkPattern64];
        counter = 0;
        while (self.word.length == 7 && !self.result && counter < word7Exec.length) {
          word7Exec[counter]();
          counter++;
        }

        var word6Exec = [self.checkPattern63, self.removeSuf5432, self.removeSuf1, self.checkPattern64];
        counter = 0;
        while (self.word.length == 6 && !self.result && counter < word6Exec.length) {
          word6Exec[counter]();
          counter++;
        }

        var word5Exec = [self.checkPattern53, self.removeSuf5432, self.removeSuf1, self.checkPattern54];
        counter = 0;
        while (self.word.length == 5 && !self.result && counter < word5Exec.length) {
          word5Exec[counter]();
          counter++;
        }

        var word4Exec = [self.checkPattern43, self.removeSuf1, self.removeSuf5432];
        counter = 0;
        while (self.word.length == 4 && !self.result && counter < word4Exec.length) {
          word4Exec[counter]();
          counter++;
        }
        return true;
      }

      self.wordCheckWitouttRemoveSuf = function() {
        var word = self.word;
        var patternChecked = false;
        if (self.word.length >= 8) {
          self.checkPattern73();
          self.checkPattern75();
          patternChecked = true;
        }

        if (self.word.length == 7) {
          self.checkPattern73();
          self.checkPattern64();
        }

        if (self.word.length == 6) {
          self.checkPattern64();
          self.checkPattern63();
        }

        if (self.word.length == 5) {
          self.checkPattern54();
          self.checkPattern54();
        }

        if (self.word.length == 4) {
          self.checkPattern43();
        }
        return true;
      }

      self.checkPattern43 = function() {
        self.patternCheck(self.patterns.pt43)
      }
      self.checkPattern53 = function() {
        self.patternCheck(self.patterns.pt53)
      }
      self.checkPattern54 = function() {
        self.patternCheck(self.patterns.pt54)
      }
      self.checkPattern63 = function() {
        self.patternCheck(self.patterns.pt63)
      }
      self.checkPattern64 = function() {
        self.patternCheck(self.patterns.pt64)
      }
      self.checkPattern73 = function() {
        self.patternCheck(self.patterns.pt73)
      }
      self.checkPattern75 = function() {
        self.patternCheck(self.patterns.pt75)
      }

      /* and return a function that stems a word for the current locale */
      return function(token) {
        // for lunr version 2
        if (typeof token.update === "function") {
          return token.update(function(word) {
            self.setCurrent(word);
            self.stem();
            return self.getCurrent();
          })
        } else { // for lunr version <= 1
          self.setCurrent(token);
          self.stem();
          return self.getCurrent();
        }
      }

    })();

    lunr.Pipeline.registerFunction(lunr.fa.stemmer, 'stemmer-fa');

    lunr.fa.stopWordFilter = lunr.generateStopWordFilter('۰ ۱ ۲ ۳ ۴ ۵ ۶ ۷ ۸ ۹ " «  » . , ، # - _ ؛, ر مقصرند مقصری ملیارد ملیون ممکن ممیزیهاست من منتهی منطقی منی مواجهند موارد موجودند مورد موقتا مکرر مکرراً مگر مگر آن که مگر این که مگو می میان میزان میلیارد میلیون میکند میکنم میکنند میکنی میکنید میکنیم می‌تواند می‌خواهیم می‌داند می‌رسد می‌رود می‌شود می‌کنم می‌کنند می‌کنیم ن ناخواسته ناراضی اند ناشی نام ناگاه ناگهان ناگهانی نباید نبش نبود نخست نخستین نخواهد نخواهم نخواهند نخواهی نخواهید نخواهیم نخودی ندارد ندارم ندارند نداری ندارید نداریم نداشت نداشتم نداشتند نداشته نداشتی نداشتید نداشتیم نزد نزدِ نزدیک نزدیکِ نسبتا نشان نشده نظیر نفرند نماید نموده نمی نمی‌شود نمی‌کند نه نه تنها نهایتا نهایتاً نوع نوعاً نوعی نکرده نکن نکند نکنم نکنند نکنی نکنید نکنیم نگاه نگو نیازمندند نیز نیست نیستم نیستند نیستیم نیمی ه ها های هایی هبچ هر هر از گاهی هر چند هر چند که هر چه هرچند هرچه هرکس هرگاه هرگز هزار هست هستم هستند هستی هستید هستیم هفت هق هق کنان هم هم اکنون هم اینک همان همان طور که همان گونه که همانا همانند همانها همدیگر همزمان همه همه روزه همه ساله همه شان همهٌ همه‌اش همواره همچنان همچنان که همچنین همچون همچین همگان همگی همیشه همین همین که هنوز هنگام هنگامِ هنگامی هنگامی که هوی هی هیچ هیچ گاه هیچکدام هیچکس هیچگاه هیچگونه هیچی و و لا غیر وابسته اند واقعا واقعاً واقعی واقفند واما وای وجود وحشت زده وسطِ وضع وقتی وقتی که وقتیکه ولی وگرنه وگو وی ویا ویژه پ پارسال پارسایانه پاره‌ای پاعینِ پایین ترند پدرانه پرسان پروردگارا پریروز پس پس از پس فردا پشت پشتوانه اند پنج پهن شده پی پی درپی پیدا پیداست پیرامون پیش پیشاپیش پیشتر پیشِ پیوسته چ چاپلوسانه چت چته چرا چرا که چشم بسته چطور چقدر چنان چنانچه چنانکه چند چند روزه چندان چنده چندین چنین چه چه بسا چه طور چهار چو چون چکار چگونه چی چیز چیزی چیزیست چیست چیه ژ ک کارند کاش کاشکی کامل کاملا کاملاً کتبا کجا کجاست کدام کرد کردم کردن کردند کرده کردی کردید کردیم کس کسانی کسی کل کلا کلی کلیه کم کم کم کما کماکان کمتر کمتره کمتری کمی کن کنار کنارش کنارِ کنایه‌ای کند کنم کنند کننده کنون کنونی کنی کنید کنیم که کو کَی کی گ گاه گاهی گذاری گذاشته گذشته گردد گردند گرفت گرفتارند گرفتم گرفتن گرفتند گرفته گرفتی گرفتید گرفتیم گروهی گرچه گفت گفتم گفتن گفتند گفته گفتی گفتید گفتیم گه گهگاه گو گونه گوی گویا گوید گویم گویند گویی گویید گوییم گیر گیرد گیرم گیرند گیری گیرید گیریم ی یا یاب یابد یابم یابند یابی یابید یابیم یارب یافت یافتم یافتن یافته یافتی یافتید یافتیم یعنی یقینا یقیناً یه یواش یواش یک یک جوری یک کم یک کمی یکدیگر یکریز یکسال یکهزار یکی'.split(' '));

    lunr.Pipeline.registerFunction(lunr.fa.stopWordFilter, 'stopWordFilter-fa');
  };
}))