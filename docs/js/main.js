/* ============================================================
   puck213 포트폴리오 동작 스크립트
   ------------------------------------------------------------
   1) 다크 모드 / 라이트 모드 전환
   2) 스크롤 위치에 따라 상단 메뉴 강조
   3) 바닥글 연도 자동 표시
   ============================================================ */

(function () {
  "use strict";

  var STORAGE_KEY = "theme"; // 브라우저에 테마 선택을 기억해 두는 이름
  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");

  /* ---------- 1. 테마 전환 ---------- */
  function applyTheme(theme, shouldSave) {
    var isDark = theme === "dark";

    root.setAttribute("data-theme", theme);

    if (toggle) {
      var icon = toggle.querySelector(".theme-icon");
      var label = toggle.querySelector(".theme-label");

      toggle.setAttribute("aria-pressed", String(isDark));
      toggle.setAttribute(
        "aria-label",
        isDark ? "라이트 모드로 전환" : "다크 모드로 전환"
      );

      if (icon) icon.textContent = isDark ? "🌙" : "☀️";
      if (label) label.textContent = isDark ? "다크" : "라이트";
    }

    // 모바일 브라우저 주소창 색상도 테마에 맞춰 줍니다.
    var metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute("content", isDark ? "#07070d" : "#f7f7fb");
    }

    // 파일을 더블클릭해서 열면 저장이 막힐 수 있으므로 오류는 무시합니다.
    if (shouldSave) {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch (e) {}
    }
  }

  if (toggle) {
    // 페이지를 열었을 때의 현재 테마로 버튼 모양을 맞춥니다.
    applyTheme(root.getAttribute("data-theme") === "light" ? "light" : "dark", false);

    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(next, true);
    });
  }

  /* ---------- 2. 현재 섹션 메뉴 강조 ---------- */
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll(".site-nav a[href^='#']")
  );

  if (navLinks.length && "IntersectionObserver" in window) {
    var linkMap = {};

    navLinks.forEach(function (link) {
      linkMap[link.getAttribute("href").slice(1)] = link;
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          navLinks.forEach(function (link) {
            link.classList.remove("is-active");
          });

          var active = linkMap[entry.target.id];
          if (active) active.classList.add("is-active");
        });
      },
      // 화면 위쪽 40% 안에 들어온 섹션을 '현재 섹션'으로 봅니다.
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    Object.keys(linkMap).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }

  /* ---------- 3. 바닥글 연도 ---------- */
  var year = document.getElementById("year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
})();
