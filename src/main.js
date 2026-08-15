import { createClient } from
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


// ========================================
// SUPABASE 설정
// ========================================
//
// 다음 단계에서 Supabase 프로젝트를 만든 뒤
// 아래 두 값을 자신의 값으로 바꿉니다.
//
// 예:
// const SUPABASE_URL = "https://xxxxx.supabase.co";
// const SUPABASE_ANON_KEY = "eyJ...";
//

const SUPABASE_URL = "YOUR_SUPABASE_URL";

const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";


const SUPABASE_URL =
  "https://bhykntnqofpuwesnpbv.supabase.co";

const SUPABASE_ANON_KEY =
  "sb_publishable_Yzf8Zkskk0lTq1wGiWAFOg_9E_iShgP";
);


// ========================================
// 기본 요소
// ========================================

const wikiList =
  document.getElementById("wiki-list");

const applyForm =
  document.getElementById("apply-form");

const applyResult =
  document.getElementById("apply-result");


// ========================================
// 홈페이지 기본 정보
// ========================================

async function loadSiteInfo() {

  if (
    SUPABASE_URL === "YOUR_SUPABASE_URL"
  ) {
    return;
  }

  const { data, error } = await supabase
    .from("site_info")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) {
    console.error(
      "사이트 정보를 불러오지 못했습니다.",
      error
    );

    return;
  }

  if (!data) {
    return;
  }


  const heroDescription =
    document.getElementById(
      "hero-description"
    );

  const heroStatus =
    document.getElementById(
      "hero-status"
    );

  const introTeam =
    document.getElementById(
      "intro-team"
    );

  const introDirection =
    document.getElementById(
      "intro-direction"
    );

  const introNotice =
    document.getElementById(
      "intro-notice"
    );


  if (heroDescription) {
    heroDescription.textContent =
      data.hero_description || "";
  }

  if (heroStatus) {
    heroStatus.textContent =
      data.hero_title || "";
  }

  if (introTeam) {
    introTeam.textContent =
      data.team_description || "";
  }

  if (introDirection) {
    introDirection.textContent =
      data.direction || "";
  }

  if (introNotice) {
    introNotice.textContent =
      data.notice || "";
  }
}


// ========================================
// 팀 위키 불러오기
// ========================================

async function loadWiki() {

  if (
    SUPABASE_URL === "YOUR_SUPABASE_URL"
  ) {
    wikiList.innerHTML = `
      <article class="wiki-card">
        <h3>청라삼데스 위키</h3>
        <p>
          Supabase 연결 후
          관리자 페이지에서 위키를 등록할 수 있습니다.
        </p>
      </article>
    `;

    return;
  }


  const { data, error } = await supabase
    .from("wiki")
    .select("*")
    .order("sort_order", {
      ascending: true
    })
    .order("created_at", {
      ascending: true
    });


  if (error) {

    console.error(
      "위키를 불러오지 못했습니다.",
      error
    );

    wikiList.innerHTML = `
      <article class="wiki-card">
        <h3>위키를 불러올 수 없습니다.</h3>
        <p>
          잠시 후 다시 시도해주세요.
        </p>
      </article>
    `;

    return;
  }


  if (!data || data.length === 0) {

    wikiList.innerHTML = `
      <article class="wiki-card">
        <h3>아직 등록된 위키가 없습니다.</h3>
        <p>
          관리자 페이지에서 첫 번째 위키를 등록해주세요.
        </p>
      </article>
    `;

    return;
  }


  wikiList.innerHTML = "";


  data.forEach((item) => {

    const card =
      document.createElement("article");

    card.className =
      "wiki-card";


    const title =
      document.createElement("h3");

    title.textContent =
      item.title || "제목 없음";


    const content =
      document.createElement("p");

    content.textContent =
      item.content || "";


    card.appendChild(title);

    card.appendChild(content);

    wikiList.appendChild(card);

  });
}


// ========================================
// 입단 지원서 제출
// ========================================

if (applyForm) {

  applyForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      if (
        SUPABASE_URL ===
        "YOUR_SUPABASE_URL"
      ) {

        applyResult.textContent =
          "아직 사이트 DB가 연결되지 않았습니다.";

        applyResult.style.color =
          "#d90818";

        return;
      }


      const formData =
        new FormData(applyForm);


      const name =
        formData.get("name")?.trim();

      const grade =
        formData.get("grade")?.trim();

      const phone =
        formData.get("phone")?.trim();

      const position =
        formData.get("position")?.trim();

      const experience =
        formData.get("experience")?.trim();

      const motivation =
        formData.get("motivation")?.trim();

      const consent =
        formData.get("consent");


      if (!name || !grade || !phone) {

        applyResult.textContent =
          "이름, 학년, 연락처를 입력해주세요.";

        applyResult.style.color =
          "#d90818";

        return;
      }


      if (!consent) {

        applyResult.textContent =
          "개인정보 수집 및 지원서 접수에 동의해주세요.";

        applyResult.style.color =
          "#d90818";

        return;
      }


      const submitButton =
        applyForm.querySelector(
          ".submit-button"
        );


      if (submitButton) {

        submitButton.disabled = true;

        submitButton.textContent =
          "제출 중...";
      }


      const { error } =
        await supabase
          .from("applications")
          .insert([
            {
              name: name,
              grade: grade,
              phone: phone,
              position: position,
              experience: experience,
              motivation: motivation
            }
          ]);


      if (error) {

        console.error(
          "지원서 제출 오류:",
          error
        );


        applyResult.textContent =
          "지원서 제출에 실패했습니다. 잠시 후 다시 시도해주세요.";

        applyResult.style.color =
          "#d90818";


        if (submitButton) {

          submitButton.disabled = false;

          submitButton.textContent =
            "입단 지원서 제출";
        }


        return;
      }


      applyResult.textContent =
        "지원서가 정상적으로 접수되었습니다.";

      applyResult.style.color =
        "#1594df";


      applyForm.reset();


      if (submitButton) {

        submitButton.disabled = false;

        submitButton.textContent =
          "입단 지원서 제출";
      }

    }
  );

}


// ========================================
// 페이지 시작
// ========================================

loadSiteInfo();

loadWiki();
