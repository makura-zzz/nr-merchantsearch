// ==========================
// 保存キー
// ==========================
const FAVORITE_KEY = "favorites";
const HIDDEN_KEY = "hidden";

// ==========================
// 状態
// ==========================
let favorites = new Set(JSON.parse(localStorage.getItem(FAVORITE_KEY) || "[]"));
let hidden = new Set(JSON.parse(localStorage.getItem(HIDDEN_KEY) || "[]"));

// ==========================
// 初期化
// ==========================
window.addEventListener("DOMContentLoaded", () => {

    bindEvents();

    // 初回描画後に反映
    setTimeout(applyStateToTable, 0);
});

// ==========================
// チェックボックスイベント監視
// ==========================
function bindEvents() {

    document.addEventListener("change", (e) => {

        const row = e.target.closest("tr");
        if (!row) return;

        const id = row.dataset.id;
        if (!id) return;

        // お気に入り
        if (e.target.classList.contains("favCheck")) {
            toggleFavorite(id);
        }

        // 非表示
        if (e.target.classList.contains("hideCheck")) {
            toggleHidden(id);
        }
    });
}

// ==========================
// お気に入り切替
// ==========================
function toggleFavorite(id) {

    if (favorites.has(id)) {
        favorites.delete(id);
    } else {
        favorites.add(id);
    }

    save();
    refresh();
}

// ==========================
// 非表示切替
// ==========================
function toggleHidden(id) {

    if (hidden.has(id)) {
        hidden.delete(id);
    } else {
        hidden.add(id);
    }

    save();
    refresh();
}

// ==========================
// 保存
// ==========================
function save() {
    localStorage.setItem(FAVORITE_KEY, JSON.stringify([...favorites]));
    localStorage.setItem(HIDDEN_KEY, JSON.stringify([...hidden]));
}

// ==========================
// script.jsの再描画呼び出し
// ==========================
function refresh() {

    const select = document.getElementById("merchantSelect");
    if (!select) return;

    updateView(select.value);

    setTimeout(applyStateToTable, 0);
}

// ==========================
// テーブルに状態反映
// ==========================
function applyStateToTable() {

    const rows = document.querySelectorAll(".itemTable tbody tr");

    rows.forEach(row => {

        const id = row.dataset.id;

        if (!id) return;

        // 非表示
        if (hidden.has(id) && !showHidden) {
            row.style.display = "none";
        } else {
            row.style.display = "";
        }

	//お気に入り強調
	if (favorites.has(id)) {
		row.classList.add("favoriteRow");
	} else {
		row.classList.remove("favoriteRow");
	}
	

        // チェック状態反映
        const favCell = row.querySelector(".favoriteCell");
        const hideCell = row.querySelector(".hiddenCell");

        if (favCell) {
            favCell.innerHTML = `
                <input type="checkbox" class="favCheck"
                ${favorites.has(id) ? "checked" : ""}>
            `;
        }

        if (hideCell) {
            hideCell.innerHTML = `
                <input type="checkbox" class="hideCheck"
                ${hidden.has(id) ? "checked" : ""}>
            `;
        }
    });

    applyFavoriteSort();
}

// ==========================
// お気に入りを上に移動
// ==========================
function applyFavoriteSort() {

    const tables = document.querySelectorAll(".itemTable");

    tables.forEach(table => {

        const tbody = table.querySelector("tbody");
        const rows = Array.from(tbody.querySelectorAll("tr"));

        rows.sort((a, b) => {

            const aFav = favorites.has(a.dataset.id) ? 1 : 0;
            const bFav = favorites.has(b.dataset.id) ? 1 : 0;

            return bFav - aFav;
        });

        rows.forEach(row => tbody.appendChild(row));
    });
}

// ==========================
// script.jsフック（安全対策）
// ==========================
if (typeof window.updateView === "function") {

    const _updateView = window.updateView;

    window.updateView = function (id) {

        _updateView(id);

        setTimeout(applyStateToTable, 0);
    };
}

// ==========================
// 非表示表示用
// ==========================
let showHidden = false;

window.addEventListener("DOMContentLoaded", () => {
	const toggle = document.getElementById("showHiddenToggle");
	if (!toggle) return ;
	toggle.addEventListener("change", (e) => {
	showHidden = e.target.checked;
	applyStateToTable();
	});
});

// ==========================
// 常設商人表示用
// ==========================
window.showMerchant = false;

document.addEventListener("change", (e) => {
	if (e.target && e.target.id === "showMerchantToggle") {
		window.showMerchant = e.target.checked;
//		console.log("showMerchant =", window.showMerchant);
		refresh();
		setTimeout(() => {
			if (typeof applyStateToTable === "function") { applyStateToTable(); }
			}, 0);
		}
	});

