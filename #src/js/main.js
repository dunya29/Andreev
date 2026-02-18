const header = document.querySelector(".header")
const footer = document.querySelector(".footer")
const iconMenu = document.querySelector('.icon-menu');
const modal = document.querySelectorAll(".modal")
const successModal = document.querySelector(".success-mod")
const errorModal = document.querySelector(".error-mod")
const cookiePopup = document.querySelector("#cookie-popup")
let animSpd = 400
let bp = {
    largeDesktop: 1550.98,
    desktop: 1250.98,
    laptop: 1023.98,
    tablet: 767.98,
    phone: 575.98
}
//scroll pos
function scrollPos() {
    return window.scrollY || window.pageYOffset || document.documentElement.scrollTop
}
// phone validation
function isPhone(value) {
    return value.match(/^\+7 \d{3} \d{3}-\d{2}-\d{2}$/) ? true : false
}
//maskEmail
function maskEmail(email) {
    const [username, domain] = email.split('@');
    let maskedUsername = '';
    if (username.length <= 3) {
        maskedUsername = username.substring(0, 1) + "***";
    } else {
        maskedUsername = username.substring(0, 2) + '***' + username.substring(username.length - 1);
    }
    return maskedUsername + '@' + domain;
}
function checkIOS() {
    let platform = navigator.platform;
    let userAgent = navigator.userAgent;
    return (
        // iPhone, iPod, iPad
        /(iPhone|iPod|iPad)/i.test(platform) ||
        // iPad на iOS 13+
        (platform === 'MacIntel' && navigator.maxTouchPoints > 1 && !window.MSStream) ||
        // User agent проверка
        (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream)
    );
}
let isIOS = checkIOS()
//enable scroll
function enableScroll() {
    if (!document.querySelector(".modal.open")) {
        if (document.querySelectorAll(".fixed-block")) {
            document.querySelectorAll(".fixed-block").forEach(block => block.style.paddingRight = '0px')
        }
        document.body.style.paddingRight = '0px'
        document.body.classList.remove("no-scroll")

        // для IOS
        if (isIOS) {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            let scrollY = document.body.dataset.scrollY;
            window.scrollTo(0, parseInt(scrollY || '0'));
        }
    }
}
//disable scroll
function disableScroll() {
    if (!document.querySelector(".modal.open")) {
        let paddingValue = window.innerWidth > 350 ? window.innerWidth - document.documentElement.clientWidth + 'px' : 0
        if (document.querySelector(".fixed-block")) {
            document.querySelectorAll(".fixed-block").forEach(block => block.style.paddingRight = paddingValue)
        }
        document.body.style.paddingRight = paddingValue
        document.body.classList.add("no-scroll");
        // для IOS
        if (isIOS) {
            let scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.top = `-${scrollY}px`;
            document.body.dataset.scrollY = scrollY;
        }
    }
}
//smoothdrop
function smoothDrop(header, body, dur = false) {
    let animDur = dur ? dur : 500
    body.style.overflow = 'hidden';
    body.style.transition = `height ${animDur}ms ease`;
    body.style['-webkit-transition'] = `height ${animDur}ms ease`;
    if (!header.classList.contains("active")) {
        header.parentNode.classList.add("active")
        body.style.display = 'block';
        let height = body.clientHeight + 'px';
        body.style.height = '0px';
        setTimeout(function () {
            body.style.height = height;
            setTimeout(() => {
                body.style.height = null
                header.classList.add("active")
                header.setAttribute("aria-expanded", true)
            }, animDur);
        }, 0);
    } else {
        header.parentNode.classList.remove("active")
        let height = body.clientHeight + 'px';
        body.style.height = height
        setTimeout(function () {
            body.style.height = "0"
            setTimeout(() => {
                body.style.display = 'none';
                body.style.height = null
                header.classList.remove("active")
                header.setAttribute("aria-expanded", false)
            }, animDur);
        }, 0);
    }
}
// custom scroll FF
const customScroll = document.querySelectorAll(".custom-scroll")
let isFirefox = typeof InstallTrigger !== 'undefined';
if (isFirefox) {
    document.documentElement.style.scrollbarColor = "#131313 transparent"
    if (customScroll.length) {
        customScroll.forEach(item => { item.style.scrollbarColor = "#131313 transparent" })
    }
}
//anchor
const anchorLinks = document.querySelectorAll(".js-anchor")
if (anchorLinks.length) {
    anchorLinks.forEach(item => {
        item.addEventListener("click", e => {
            let idx = item.getAttribute("href").indexOf("#")
            const href = item.getAttribute("href").substring(idx)
            let dest = document.querySelector(href)
            if (dest) {
                e.preventDefault()
                let destPos = dest.getBoundingClientRect().top - header.clientHeight - 10
                if (iconMenu.classList.contains("active")) {
                    iconMenu.click()
                    setTimeout(() => {
                        window.scrollTo({ top: scrollPos() + destPos, behavior: 'smooth' })
                    }, 300);
                } else {
                    window.scrollTo({ top: scrollPos() + destPos, behavior: 'smooth' })
                }
            }
        })
    })
}
//open modal
function openModal(modal) {
    let activeModal = document.querySelector(".modal.open")
    disableScroll()
    if (activeModal) {
        activeModal.classList.remove("open")
    }
    modal.classList.add("open")
}
//close modal
function closeModal(modal) {
    if (modal.querySelector("video")) {
        modal.querySelectorAll("video").forEach(item => item.pause())
    }
    modal.classList.remove("open")
    setTimeout(() => {
        enableScroll()
    }, animSpd);
}
// modal click outside
if (modal.length) {
    modal.forEach((mod) => {
        mod.addEventListener("click", (e) => {
            if (!mod.querySelector(".modal__content").contains(e.target)) {
                closeModal(mod);
            }
        });
        mod.querySelectorAll(".modal__close").forEach(btn => {
            btn.addEventListener("click", () => {
                closeModal(mod)
            })
        })
    });
}
// modal button on click
function modalShowBtns() {
    const modOpenBtn = document.querySelectorAll(".mod-open-btn")
    if (modOpenBtn.length) {
        modOpenBtn.forEach(btn => {
            btn.addEventListener("click", e => {
                e.preventDefault()
                let href = btn.getAttribute("data-modal")
                openModal(document.getElementById(href))
            })
        })
    }
}
modalShowBtns()
// modal close button on click
function modalUnshowBtns() {
    const modCloseBtn = document.querySelectorAll(".mod-close-btn")
    if (modCloseBtn.length) {
        modCloseBtn.forEach(btn => {
            btn.addEventListener("click", e => {
                e.preventDefault()
                let href = btn.getAttribute("data-modal")
                closeModal(document.getElementById(href))
            })
        })
    }
}
modalUnshowBtns()
// setSuccessTxt
function setSuccessTxt(title = false, txt = false, btnTxt = false) {
    successModal.querySelector("h2").textContent = title ? title : "Заявка отправлена"
    successModal.querySelector(".main-btn span").textContent = btnTxt ? btnTxt : "Закрыть"
    successModal.querySelector("p").textContent = txt ? txt : "Я свяжусь c Вами в течение 15 минут"
}
// setErrorTxt
function setErrorTxt(title = false, txt = false, btnTxt = false) {
    errorModal.querySelector("h2").textContent = title ? title : "Что-то пошло не так"
    errorModal.querySelector(".main-btn span").textContent = btnTxt ? btnTxt : "Закрыть"
    errorModal.querySelector("p").textContent = txt ? txt : "Попробуйте еще раз"
}
// openSuccessMod
function openSuccessMod(title = false, txt = false, btnTxt = false) {
    setSuccessTxt(title, txt, btnTxt)
    openModal(successModal)
}
// openErrorMod
function openErrorMod(title = false, txt = false, btnTxt = false) {
    setErrorTxt(title, txt, btnTxt)
    openModal(errorModal)
}
//formReset
function formReset(form) {
    if (form.querySelectorAll(".item-form").length > 0) {
        form.querySelectorAll(".item-form").forEach(item => item.classList.remove("error"))
    }
    if (form.querySelectorAll(".item-form__reset").length > 0) {
        form.querySelectorAll(".item-form__reset").forEach(item => item.classList.remove("show"))
    }
    /* if (form.querySelectorAll("[data-error]").length > 0) {
        form.querySelectorAll("[data-error]").forEach(item => item.textContent = '')
    } */
    form.querySelectorAll("input").forEach(inp => {
        if (!["hidden", "checkbox", "radio"].includes(inp.type)) {
            inp.value = ""
        }
        if (["checkbox", "radio"].includes(inp.type) && !inp.classList.contains("required")) {
            inp.checked = false
        }
    })
    if (form.querySelector("textarea")) {
        form.querySelector("textarea").value = ""
    }
    if (form.querySelector(".file-form__items")) {
        form.querySelector(".file-form__items").innerHTML = ""
    }
}
//reset input field
function showResetBtn(item, resetBtn) {
    if (item.querySelector("input").value.length > 0) {
        resetBtn.classList.add("show")
    } else {
        resetBtn.classList.remove("show")
    }
}
const itemForm = document.querySelectorAll(".item-form")
if (itemForm) {
    itemForm.forEach(item => {
        const resetBtn = item.querySelector(".item-form__reset")
        if (resetBtn) {
            showResetBtn(item, resetBtn)
            item.querySelector("input").addEventListener("input", e => {
                showResetBtn(item, resetBtn)
            })
            resetBtn.addEventListener("click", e => {
                e.preventDefault()
                item.querySelector("input").value = ""
                resetBtn.classList.remove("show")
            })
        }
    })
}
//mask input
const inpTel = document.querySelectorAll('input[type=tel]')
if (inpTel.length) {
    inpTel.forEach(item => {
        Inputmask({ "mask": "+7 999 999-99-99" }).mask(item);
    })
}
//accordion
const accordion = document.querySelectorAll(".accordion")
if (accordion.length) {
    accordion.forEach(item => {
        item.querySelector(".accordion__header").addEventListener("click", () => {
            if (!item.classList.contains("no-close")) {
                item.parentNode.parentNode.querySelectorAll(".accordion").forEach(el => {
                    if (el.querySelector(".accordion__header").classList.contains("active")) {
                        smoothDrop(el.querySelector(".accordion__header"), el.querySelector(".accordion__body"))
                        if (el.getBoundingClientRect().top < 0) {
                            let pos = scrollPos() + item.getBoundingClientRect().top - el.querySelector(".accordion__body").clientHeight - header.clientHeight - 10
                            window.scrollTo(0, pos)
                        }
                    }
                })
            }
            smoothDrop(item.querySelector(".accordion__header"), item.querySelector(".accordion__body"))
        })
    })
}

// fixedBtn visibility on scroll
const intro = document.querySelector(".intro");
const fixedBtn = document.querySelector(".fixed-btn")
let fixedBtnTimeout;
function fixedBtnVisibility() {
    clearTimeout(fixedBtnTimeout)
    fixedBtnTimeout = setTimeout((() => {
        if (intro.getBoundingClientRect().bottom < 0 && window.innerHeight - footer.getBoundingClientRect().bottom + 50 < 0) {
            fixedBtn.classList.add("show")
            if (cookiePopup) {
                cookiePopup.classList.add("fixed-btn-isVisible")
            }
        } else {
            fixedBtn.classList.remove("show")
            if (cookiePopup) {
                cookiePopup.classList.remove("fixed-btn-isVisible")
            }
        }
    }
    ), 100)
}
if (intro && fixedBtn) {
    fixedBtnVisibility()
    window.addEventListener("scroll", fixedBtnVisibility)
}
//menu
const headerNav = document.querySelector(".header__nav")
if (iconMenu && headerNav) {
    iconMenu.addEventListener("click", () => {
        if (!iconMenu.classList.contains("active")) {
            iconMenu.setAttribute("aria-label", "Закрыть меню")
            iconMenu.classList.add("active")
            headerNav.classList.add("open")
            disableScroll()
        } else {
            iconMenu.setAttribute("aria-expanded", false)
            iconMenu.setAttribute("aria-label", "Открыть меню")
            iconMenu.classList.remove("active")
            headerNav.classList.remove("open")
            enableScroll()
        }
    })
    window.addEventListener("resize", () => {
        if (window.innerWidth > bp.desktop && iconMenu.classList.contains("active")) {
            iconMenu.click()
        }
    })
}
// pageUp
const pageUp = document.querySelector(".page-up")
if (pageUp) {
    pageUp.addEventListener("click", () => window.scrollTo({ top: 0, behavior: 'smooth' }))
}
//show cookie
function showCookie() {
    if (cookiePopup) {
        cookiePopup.classList.add("show")
        cookiePopup.setAttribute('aria-hidden', 'false');
    }
}
//show cookie
function unshowCookie() {
    if (cookiePopup) {
        cookiePopup.classList.remove("show")
        setTimeout(() => {
            cookiePopup.remove()
        }, 300);
    }
}
// cookie
let COOKIE_NAME = 'site_cookie_consent';
let COOKIE_VALUE = 'accepted';
let COOKIE_DAYS = 365;
function setCookie() {
    const date = new Date();
    date.setTime(date.getTime() + COOKIE_DAYS * 24 * 60 * 60 * 1000);
    const expires = "expires=" + date.toUTCString();
    const baseDomain = location.hostname.replace(/^www\./, '');
    const domainPart = baseDomain.includes('.') ? `; domain=.${baseDomain}` : '';
    let cookieStr = `${COOKIE_NAME}=${encodeURIComponent(COOKIE_VALUE)}; ${expires}; path=/; SameSite=Lax${domainPart}`;

    if (location.protocol === 'https:') cookieStr += '; Secure';
    document.cookie = cookieStr;
}
function hasCookieAccepted() {
    try {
        if (localStorage.getItem(COOKIE_NAME) === COOKIE_VALUE) return true;
    } catch (e) { }

    const v = document.cookie
        .split('; ')
        .find(row => row.startsWith(COOKIE_NAME + '='))
        ?.split('=')[1];

    return decodeURIComponent(v || '') === COOKIE_VALUE;
}

window.addEventListener("DOMContentLoaded", () => {
    if (cookiePopup) {
        if (!hasCookieAccepted()) {
            showCookie();
        } else {
            unshowCookie();
        }
    }

})
AOS.init({
    duration: 700,
    once: true,
});
if (footer) {
    const footerObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                footer.classList.add('animate');
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: "0px"
    })
    footerObserver.observe(footer);
}
