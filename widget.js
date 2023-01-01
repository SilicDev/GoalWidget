let backgroundColor, progressBarColor;

let count = 0,
    goalType;
let goalTotal = 0,
    goalMessage;

 let image_url = "";

window.addEventListener('onEventReceived', function (obj) {
    if (!obj.detail.event) {
      return;
    }
    if (typeof obj.detail.event.itemId !== "undefined") {
        obj.detail.listener = "redemption-latest"
    }
    const listener = obj.detail.listener.split("-")[0];
    const event = obj.detail.event;
    if (event.listener === 'widget-button') {
      if (event.field === 'testCounterUp') {
        count += 1;
        updateWidget();
      }
    }
});

window.addEventListener('onWidgetLoad', function (obj) {
    let data = obj.detail.session.data;
    const fieldData = obj.detail.fieldData;
  	goalType = fieldData.goalType;
  	goalTotal = fieldData.goalTotal;
  	goalMessage = fieldData.goalMessage;
  	backgroundColor = fieldData.backgroundColor;
  	progressBarColor = fieldData.progressBarColor;
  	count = data[`${goalType.toLowerCase()}-total`].count;
  	generateWidget();
});

window.addEventListener('onSessionUpdate', function (obj) {
    let data = obj.detail.session;
  	count = data[`${goalType.toLowerCase()}-total`].count;
  	updateWidget();
});


function generateWidget() {
  let ratio = (count/goalTotal) * 100;
  if (goalType.toLowerCase().includes("subscriber")) {
      image_url = "https://static.twitchcdn.net/assets/subscribe-2d3225207e704bd2aa2d.svg";
  } else {
      image_url = "https://static.twitchcdn.net/assets/follow-c7d174e9553cfc22fa72.svg";
  }
  let element = `
	<div id="goal" class="goal_widget goal_container">
      <div class="goal_widget goal_bg" style="background-color: {backgroundColor}; border: 1.5px solid rgb(173, 173, 184);">
        <div id="bar" class="goal_widget goal_progress_bar" style="width: ${ratio}%; background-color: {progressBarColor};">
        </div>
        <div class="goal_widget goal_body">
          <img class="goal_image" alt="{goalMessage}" src="${image_url}">
          <div class="goal_widget goal_metadata">
            <div class="goal_widget goal_message" style="color: rgb(239, 239, 241);">{goalMessage}</div>
            <div class="goal_widget goal_contributions" style="color: rgb(239, 239, 241);">
                <span id="count">${count}</span> / <span id="goalTotal">{goalTotal}</span> {goalType}s
            </div>
          </div>
        </div>
      </div>
    </div>`;
  $('.main-container').show().append(element);
}

function updateWidget() {
  	let ratio = (count/goalTotal) * 100;
    $("#bar").css('width', Math.min(100, ratio) + "%");
    $("#count").html(`${count}`);
    $("#goalTotal").html(`{goalTotal}`);
}