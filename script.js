//ページを開いたら開始
window.addEventListener("DOMContentLoaded", init);

//アイテム辞書
let itemMap = {};

function init(){

	//idで検索できるようにする（辞書化）
	items.forEach(item => {itemMap[item.id] = item;});

	//プルダウン作成
	createMerchantSelect();
	const select = document.getElementById("merchantSelect");
	select.addEventListener("change", (e) =>{updateView(e.target.value); });
	
}

//プルダウン
function createMerchantSelect(){
	const select = document.getElementById("merchantSelect");

//merchantTablesのキーを取得
Object.keys(merchantTables).forEach(shopID => {
	const option = document.createElement("option");
		option.value = shopID;
		const data = merchantTables[shopID];
		const judge = data.judgeItem;
		option.textContent =`${itemMap[judge]?.name ?? ""}(${itemMap[judge]?.passive ?? ""})`;
		select.appendChild(option);

});
}

//テーブル作成
function renderTable(ids) {

    return `
	<table class="itemTable">
	<thead>
		<tr>
		<th>お気に入り</th>
		<th>装備名</th>
		<th>付帯内容</th>
		<th>非表示</th>
		</tr>
	</thead>
	<tbody>

	${ids.map(id => {
  	const item = itemMap[id];
	if (!item) return "";
 	return `
		<tr data-id="${id}">
		<td class="favoriteCell"></td>
		<td>${item.name}</td>
		<td>${item.passive}</td>
		<td class="hiddenCell"></td>
		</tr>
	`;
	}).join("")}
	</tbody>
	</table>
	`;

}

//セクション表示
function renderSection(title, elementId, ids = []){

    const el = document.getElementById(elementId);

    // 常設商人だけ表示制御
    if (elementId === "merchant" && !window.showMerchant) {
        el.innerHTML = "";
        return;
    }

    el.innerHTML = `
        <h2>${title}</h2>
        ${renderTable(ids)}
    `;
}			

//商人の表示更新
function updateView(id){
	if(!id) {
	renderSection("常設商人", "merchant", [] );
	renderSection("村商人", "village", [] );
	renderSection("大空洞商人", "hollows", [] );
	return;
	}

	const data =merchantTables[id];
	if(!data)return;
	//常設商人
	renderSection("常設商人", "merchant", window.showMerchant ? (data.merchant || [] ) :[] );
	//村商人
	renderSection("村商人", "village", data.village || [] );
	//大空洞商人
	renderSection("大空洞商人", "hollows", hollowsTables[data.hollows] || [] );
}


window.updateView = updateView;



