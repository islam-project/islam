document.addEventListener("DOMContentLoaded", async () => {
    const chooseReciter = document.querySelector('#chooseReciter');
    const chooseMoshaf = document.querySelector('#chooseMoshaf');
    const chooseSurah = document.querySelector('#chooseSurah');
    const audioPlayer = document.querySelector('#audioPlayer');

    if (!chooseReciter || !chooseMoshaf || !chooseSurah || !audioPlayer) {
        console.error("خطأ: لم يتم العثور على عناصر الاختيار.");
        return;
    }

    chooseReciter.innerHTML = `<option value="">اختر القارئ</option>`;
    chooseMoshaf.innerHTML = `<option value="">اختر المصحف</option>`;
    chooseSurah.innerHTML = `<option value="">اختر السورة</option>`;

    // ✅ 1. جلب جميع القرّاء
    async function getReciters() {
        try {
            const res = await fetch("https://mp3quran.net/api/v3/reciters?language=ar");
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            
            const data = await res.json();
            console.log("API Response:", data); // للتحقق من بنية البيانات
            
            // التحقق من وجود البيانات بطرق مختلفة
            const reciters = data.reciters || data.data || data;
            
            if (Array.isArray(reciters)) {
                reciters.forEach(reciter => {
                    chooseReciter.innerHTML += `<option value="${reciter.id}">${reciter.name}</option>`;
                });
            } else {
                console.error("❌ البيانات المستلمة ليست مصفوفة:", reciters);
            }
        } catch (error) {
            console.error("❌ خطأ في جلب القرّاء:", error);
            // محاولة استخدام API بديل
            await tryAlternativeAPI();
        }
    }

    // محاولة استخدام API بديل أو بنية مختلفة
    async function tryAlternativeAPI() {
        try {
            console.log("🔄 محاولة استخدام API بديل...");
            const res = await fetch("https://mp3quran.net/api/v3/languages");
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            
            const data = await res.json();
            console.log("Alternative API Response:", data);
            
            // البحث عن اللغة العربية
            const arabicData = data.find(lang => lang.language === 'ar');
            if (arabicData && arabicData.reciters) {
                arabicData.reciters.forEach(reciter => {
                    chooseReciter.innerHTML += `<option value="${reciter.id}">${reciter.name}</option>`;
                });
            }
        } catch (altError) {
            console.error("❌ خطأ في API البديل أيضاً:", altError);
            
            // إضافة قراء افتراضيين للاختبار
            const defaultReciters = [
                { id: 'ar.abdulbasitmurattal', name: 'عبد الباسط عبد الصمد - مرتل' },
                { id: 'ar.alafasy', name: 'مشاري بن راشد العفاسي' },
                { id: 'ar.abdullahbasfar', name: 'عبد الله بصفر' },
                { id: 'ar.mahermuaiqly', name: 'ماهر المعيقلي' }
            ];
            
            defaultReciters.forEach(reciter => {
                chooseReciter.innerHTML += `<option value="${reciter.id}">${reciter.name}</option>`;
            });
        }
    }

    await getReciters();

    // ✅ 2. تحديث المصاحف عند تغيير القارئ
    chooseReciter.addEventListener("change", async (e) => {
        const reciterId = e.target.value;
        if (!reciterId) {
            chooseMoshaf.innerHTML = `<option value="">اختر المصحف</option>`;
            chooseSurah.innerHTML = `<option value="">اختر السورة</option>`;
            return;
        }

        chooseMoshaf.innerHTML = `<option value="">اختر المصحف</option>`;
        chooseSurah.innerHTML = `<option value="">اختر السورة</option>`;
        
        try {
            // محاولة جلب المصاحف للقارئ المحدد
            const res = await fetch(`https://mp3quran.net/api/v3/reciters?reciter=${reciterId}&language=ar`);
            if (!res.ok) {
                // إذا فشل، استخدم API مختلف
                await loadDefaultMoshaf(reciterId);
                return;
            }
            
            const data = await res.json();
            console.log("Moshaf API Response:", data);
            
            const reciterData = data.reciters ? data.reciters[0] : data[0];
            
            if (reciterData && reciterData.moshaf) {
                reciterData.moshaf.forEach(moshaf => {
                    chooseMoshaf.innerHTML += `<option value="${moshaf.id}" data-server="${moshaf.server}" data-surah-list="${moshaf.surah_list}">${moshaf.name}</option>`;
                });
            } else {
                await loadDefaultMoshaf(reciterId);
            }
        } catch (error) {
            console.error("❌ خطأ في جلب المصاحف:", error);
            await loadDefaultMoshaf(reciterId);
        }
    });

    // تحميل مصحف افتراضي للقارئ
    async function loadDefaultMoshaf(reciterId) {
        console.log("🔄 تحميل مصحف افتراضي للقارئ:", reciterId);
        
        // مصحف افتراضي بناءً على القارئ
        const defaultMoshaf = {
            id: reciterId,
            name: 'المصحف المرتل',
            server: `https://server8.mp3quran.net/${reciterId}/`,
            surah_list: '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114'
        };
        
        chooseMoshaf.innerHTML += `<option value="${defaultMoshaf.id}" data-server="${defaultMoshaf.server}" data-surah-list="${defaultMoshaf.surah_list}">${defaultMoshaf.name}</option>`;
    }

    // ✅ 3. تحديث السور عند اختيار المصحف
    chooseMoshaf.addEventListener("change", async (e) => {
        const selectedOption = e.target.selectedOptions[0];
        if (!selectedOption || !selectedOption.value) {
            chooseSurah.innerHTML = `<option value="">اختر السورة</option>`;
            return;
        }

        const surahList = selectedOption.getAttribute('data-surah-list');
        chooseSurah.innerHTML = `<option value="">اختر السورة</option>`;

        try {
            // جلب أسماء السور من API أو استخدام قائمة افتراضية
            let surahs = [];
            
            try {
                const res = await fetch("https://mp3quran.net/api/v3/suwar?language=ar");
                if (res.ok) {
                    const data = await res.json();
                    surahs = data.suwar || data.data || data;
                }
            } catch (apiError) {
                console.log("استخدام قائمة السور الافتراضية");
            }
            
            // إذا لم تنجح API، استخدم قائمة افتراضية
            if (!Array.isArray(surahs) || surahs.length === 0) {
                surahs = getDefaultSurahs();
            }
            
            // تحويل قائمة السور المتاحة إلى مصفوفة
            const availableSurahs = surahList ? surahList.split(',').map(num => parseInt(num.trim())) : 
                                              Array.from({length: 114}, (_, i) => i + 1);
            
            // إضافة السور المتاحة فقط
            availableSurahs.forEach(surahNum => {
                const surah = surahs.find(s => (s.id || s.number) === surahNum);
                if (surah) {
                    chooseSurah.innerHTML += `<option value="${surah.id || surah.number}">${surah.name}</option>`;
                } else {
                    // إذا لم توجد السورة، أضفها برقمها فقط
                    chooseSurah.innerHTML += `<option value="${surahNum}">سورة رقم ${surahNum}</option>`;
                }
            });
        } catch (error) {
            console.error("❌ خطأ في جلب السور:", error);
            
            // في حالة الخطأ، أضف جميع السور برقمها
            for (let i = 1; i <= 114; i++) {
                chooseSurah.innerHTML += `<option value="${i}">سورة رقم ${i}</option>`;
            }
        }
    });

    // قائمة السور الافتراضية
    function getDefaultSurahs() {
        return [
            {id: 1, name: "الفاتحة"}, {id: 2, name: "البقرة"}, {id: 3, name: "آل عمران"},
            {id: 4, name: "النساء"}, {id: 5, name: "المائدة"}, {id: 6, name: "الأنعام"},
            {id: 7, name: "الأعراف"}, {id: 8, name: "الأنفال"}, {id: 9, name: "التوبة"},
            {id: 10, name: "يونس"}, {id: 11, name: "هود"}, {id: 12, name: "يوسف"},
            {id: 13, name: "الرعد"}, {id: 14, name: "إبراهيم"}, {id: 15, name: "الحجر"},
            {id: 16, name: "النحل"}, {id: 17, name: "الإسراء"}, {id: 18, name: "الكهف"},
            {id: 19, name: "مريم"}, {id: 20, name: "طه"}, {id: 21, name: "الأنبياء"},
            {id: 22, name: "الحج"}, {id: 23, name: "المؤمنون"}, {id: 24, name: "النور"},
            {id: 25, name: "الفرقان"}, {id: 26, name: "الشعراء"}, {id: 27, name: "النمل"},
            {id: 28, name: "القصص"}, {id: 29, name: "العنكبوت"}, {id: 30, name: "الروم"},
            // يمكن إضافة باقي السور...
            {id: 114, name: "الناس"}
        ];
    }

    // ✅ 4. تشغيل السورة المختارة
    chooseSurah.addEventListener('change', async (e) => {
        const surahNumber = e.target.value;
        const selectedMoshaf = chooseMoshaf.selectedOptions[0];
        
        if (!surahNumber || !selectedMoshaf) return;

        const server = selectedMoshaf.getAttribute('data-server');
        if (!server) {
            console.error("❌ لم يتم العثور على رابط الخادم!");
            return;
        }

        try {
            // تنسيق رقم السورة (إضافة أصفار في البداية إذا لزم الأمر)
            const formattedSurahNumber = surahNumber.toString().padStart(3, '0');
            
            // بناء رابط الصوت
            const audioUrl = `${server}${formattedSurahNumber}.mp3`;
            
            console.log("🔊 تشغيل الصوت من:", audioUrl);
            
            audioPlayer.src = audioUrl;
            audioPlayer.play().catch(error => {
                console.error("❌ خطأ في تشغيل الصوت:", error);
            });
        } catch (error) {
            console.error("❌ خطأ في تشغيل السورة:", error);
        }
    });
});
