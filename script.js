let startingPoints = 115, //has to be manually updated if it gets off
    goalPoints = 100,
    
    
    
	eventsLimit = 5,
    userLocale = "en-US",
    includeFollowers = false,
    includeRedemptions = false,
    includeHosts = false,
    minHost = 0,
    includeRaids = false,
    minRaid = 0,
    includeSubs = true,
    includeTips = false,
    minTip = 0,
    includeCheers = false,
    direction = "top",
    textOrder = "nameFirst",
    minCheer = 0;
    

let userCurrency,
    totalEvents = 0;

window.addEventListener('onWidgetLoad', function (obj) {
    let data=obj["detail"]["session"]["data"];
    let recents=obj["detail"]["recents"];
    let currency=obj["detail"]["currency"];
    let channelName=obj["detail"]["channel"]["username"];
    let apiToken=obj["detail"]["channel"]["apiToken"];
    let fieldData=obj["detail"]["fieldData"];
});

window.addEventListener('onEventReceived', function (obj) {
    if (obj.detail.listener !== 'subscriber-latest') {
        return;
    }
    
    const event = obj.detail.event;
    if (!event) {
        return; 
    }
  	// console.log("event: ", event);
  	if(event.gifted || event.tier === "prime" || (event.bulkGifted == true)){
      // console.log("Not a tiered sub");
      return;
    }
    const tier = event.tier ? event.tier : 1000; 

    // console.log("Tier of the latest subscriber:", tier);
    const fieldData = obj.detail.fieldData;
    fieldData["startingPoints"] = updateWidgetBar(tier);
});

window.addEventListener('onWidgetLoad', function (obj) {
  	//updateCurrentPoints();
  	document.getElementById('current-points').innerText = startingPoints;
  	document.getElementById('goal-points').innerText = goalPoints;
  	updateStartingPoints();
    //loadCurrentPoints();
  	updateWidgetBar(0);
});

async function updateStartingPoints(){
	SE_API.store.set('mywidget_currentPoints', startingPoints);
  	SE_API.store.set('mywidget_currentPoints', startingPoints);
}

function updateCurrentPoints(){
	const currentPointsElement = document.getElementById('current-points');
  	const currentPoints = parseInt(currentPointsElement.innerText);
    SE_API.store.set('mywidget_currentPoints', currentPoints);
}

function loadCurrentPoints(){
  const currentPointsElement = document.getElementById('current-points');
  if (!currentPointsElement) {
    console.error("Element with ID 'current-points' not found");
    return;
  }
  SE_API.store.get("mywidget_currentPoints").then(raw => {
    const currentPoints = raw.value;
    currentPointsElement.innerText = currentPoints;
  }).catch(error => { 
    console.error("Error retrieving value from store:", error);
    const currentPoints = parseInt(currentPointsElement.innerText);
    SE_API.store.set('mywidget_currentPoints', currentPoints);
    globalvar1 = currentPoints;
    currentPointsElement.innerText = currentPoints;
  });
};

function updateWidgetBar(tier){
  SE_API.store.get('mywidget_currentPoints')
    .then(raw => {
      tier /= 1000;
      switch (tier) {
          case 1:
              raw.value += 1;
              break;
          case 2:
              raw.value += 2;
              break;
          case 3:
              raw.value += 6;
              break;
          default:
              break;
      }
      SE_API.store.set('mywidget_currentPoints', raw.value);
      const currentPointsElement = document.getElementById('current-points');
      currentPointsElement.innerText = raw.value;

      const goalPointsElement = document.getElementById('goal-points');
      const goalPoints = parseInt(goalPointsElement.innerText); // Parse the text content, not the element itself
      if(startingPoints > goalPoints)
      {
        const fillBar = document.getElementById('fill-bar');
        const percentage = 100;
        fillBar.style.width = `${percentage}%`; // Set width dynamically
        return raw.value;
      }else{
      	 const percentage = (raw.value / goalPoints) * 100;
         const fillBar = document.getElementById('fill-bar');
         fillBar.style.width = `${percentage}%`; // Set width dynamically
         return raw.value;
      }
      
  }).catch(error => { 
      console.error("Not able to obtain current points");
      // Handle error
  });
}

function addEvent(type, text, username) {
    totalEvents += 1;
    let element;
    if (textOrder === "actionFirst") {
        element = `
    <div class="event-container" id="event-${totalEvents}">
        <div class="backgroundsvg"></div>
        <div class="event-image event-${type}"></div>
        <div class="username-container">${text}</div>
       <div class="details-container">${username}</div>
    </div>`;
    } else {
        element = `
    <div class="event-container" id="event-${totalEvents}">
        <div class="backgroundsvg"></div>
        <div class="event-image event-${type}"></div>
        <div class="username-container">${username}</div>
       <div class="details-container">${text}</div>
    </div>`;
    }
    if (direction === "bottom") {
        $('.main-container').removeClass("fadeOutClass").show().append(element);
    } else {
        $('.main-container').removeClass("fadeOutClass").show().prepend(element);
    }
    if (fadeoutTime !== 999) {
        $('.main-container').addClass("fadeOutClass");
    }
    if (totalEvents > eventsLimit) {
        removeEvent(totalEvents - eventsLimit);
    }
}

function removeEvent(eventId) {
    $(`#event-${eventId}`).animate({
        height: 0,
        opacity: 0
    }, 'slow', function () {
        $(`#event-${eventId}`).remove();
    });
}