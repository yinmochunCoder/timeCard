/**
 * Created by xiaoyanli on 2018/10/8.
 */
;(function(){

    initTimeCard();     //初始化事件面板信息
    handleSelector();   //可输入下拉框值的变化情况
    handleTimeSpan();   //点击span触发

    //初始化右边timeCard
    function initTimeCard() {
        let contentArea = document.getElementsByClassName("content-wrapper")[0]; //加载的内容区
        for ( let row = 0 ; row < 5; row++ ) {   //五行七列
            for ( let col = 0; col < 7; col++ ) { //timeCard内容div区
                let timeCardDiv = document.createElement("div");
                timeCardDiv.setAttribute("class","content-item");
                timeCardDiv.setAttribute("row", row+1);
                timeCardDiv.setAttribute("col", col);
                contentArea.appendChild(timeCardDiv);
            }
        }
    }

    //下拉框选择
    function handleSelector() {
        let selector = document.getElementById("select-year"),
            span = document.getElementsByClassName('nav-month')[0].children,
            input = document.getElementById("input-year"),
            defaultSpan = document.getElementsByClassName('nav-month')[0].children[0];
            defaultSpan.style.background = 'lightcoral';
            input.value = selector.options[0].value;
            resetRecord(span,0);
            getDateToWeek(input.value, defaultSpan.innerText);

            selector.addEventListener(
                'change',
                function() {
                   let optionIndex = this.selectedIndex;
                       defaultSpan.style.background = 'lightcoral';
                       input.value = this.options[optionIndex].value;
                       resetRecord(span,0);
                       getDateToWeek(input.value, defaultSpan.innerText);
                }
            );
    }

    //选择月份span
    function handleTimeSpan() {
        let span = document.getElementsByClassName('nav-month')[0].children,
            input = document.getElementById("input-year");
        for ( let index = 0 ; index < span.length; index++ ) {
            span[index].addEventListener(
                'click',
                function() {
                    if ( input.value === "" ) {
                        alert("请选择或输入想要查询的年份！") ;
                        return false;
                    } else {
                        span[index].style.background = 'lightcoral';
                        resetRecord(span,index);
                        getDateToWeek(input.value,span[index].innerText);
                    }
                }
            );
        }
    }


    //根据年月获取日期和星期的对应关系
    function getDateToWeek( year, monthV ) {
        let month = handleSwitchMonth(monthV);
        let date, dateCount, timeObj = [], monthFormat ;
            date = new Date( Number.parseInt(year) , month, 0 );
            dateCount = date.getDate();   //获取一月有多少天

            for ( let dateIndex = 1; dateIndex < dateCount+1; dateIndex++ ) {
                let day = new Date( Number.parseInt(year) , month-1, dateIndex );     //实例化年月日，获取星期几
                ( month < 10 ) ? ( monthFormat  = "0"+month.toString() ) : ( monthFormat = month );  //格式化小于10的月
                if ( dateIndex < 10 ) { dateIndex = '0'+dateIndex; }            //格式化小于10的日期

                timeObj.push({
                    dateO: monthFormat+"-"+dateIndex,   //当前日期
                    weekO: day.getDay(),                //获取星期几
                    weekC: Math.ceil( ( day.getDate() + 6 - day.getDay() )/ 7)  //在一个月的第几周内
                });

         }
        fillIntoTimeCard(timeObj);
    }

    //处理month
    function handleSwitchMonth( month ) {
        const monthValue = {
            'Jan': 1,
            'Feb': 2,
            'Mar': 3,
            'Apr': 4,
            'May': 5,
            'June': 6,
            'July': 7,
            'Aug': 8,
            'Sep': 9,
            'Oct': 10,
            'Nov': 11,
            'Dec': 12,
        };
        return monthValue[month];
    }


    //剩余未选中的index
    function resetRecord( span,index ) {
        for ( let subIndex = 0 ; subIndex < span.length; subIndex++ ) {
            if ( subIndex !== index ) {
                span[subIndex].style.background = 'white';
            }
        }
    }


    //格式化日期
    function fillIntoTimeCard( timeObj ) {
        let cardItems = document.getElementsByClassName("content-item"),
            row, col, dateSpan ;

        initCardItem(cardItems);  //初始化timeCard
        removeClassOfEventSpan(cardItems); //去除内容为空的背景色

        for ( let cardIndex = 0; cardIndex < cardItems.length; cardIndex++ ) {
            for ( let timeIndex = 0; timeIndex < timeObj.length; timeIndex++ ) {
                row = Number.parseInt(cardItems[cardIndex].getAttribute("row"));
                col = Number.parseInt(cardItems[cardIndex].getAttribute("col"));
                dateSpan = document.createElement("span") ;
                dateSpan.setAttribute('class','date-label');
                if ( row === timeObj[timeIndex].weekC && col === timeObj[timeIndex].weekO ) {
                    dateSpan.innerHTML = timeObj[timeIndex].dateO;
                    ( cardItems[cardIndex].firstChild === null ) ?
                    ( cardItems[cardIndex].appendChild(dateSpan) ) :
                    ( cardItems[cardIndex].replaceChild(dateSpan, cardItems[cardIndex].firstChild ) );
                    //判断节假日
                    let holidayStr = judgeHoliday(timeObj[timeIndex].dateO, col );
                    insertHolidaySpan(holidayStr,cardItems[cardIndex]);
                    //判断事件
                    let eventStr = judgeEvent(col);
                    insertEventSpan(eventStr,cardItems[cardIndex]);
                    //时间事件
                    insertTimeUl(col,cardItems[cardIndex] );
                }
            }
        }
    }

    //初始化timecard的值
    function initCardItem(items) {
        for ( let index = 0 ; index < items.length; index++ ) {
            if ( items[index].children.length !== 0 && items[index].children[0].className === 'date-label') {
                if ( items[index].children.length !== 2 ) {
                    items[index].children[0].innerHTML = "";
                    items[index].children[1].innerHTML = "";
                    items[index].children[2].innerHTML = "";
                    items[index].children[3].children[0].innerHTML = "";
                    items[index].children[3].children[1].innerHTML = "";
                } else {
                    items[index].children[0].innerHTML = "";
                    items[index].children[1].innerHTML = "";
                }
            }
        }
    }

    function removeClassOfEventSpan(items) {
        for ( let index = 0 ; index < items.length; index++  ) {
            if ( items[index].children.length !== 0 && items[index].children[0].innerHTML === "") {
                if ( items[index].children.length !== 2  ) {
                    items[index].children[2].removeAttribute("class");
                }
            }
        }
    }

    //插入右下角的工作日、节假日label
    function insertHolidaySpan( spanHtml, card ) {
        let holidaySpan = document.createElement("span");
            holidaySpan.setAttribute("class", "holiday-span");
            holidaySpan.innerHTML = spanHtml;
            if ( spanHtml === '周末' ) { holidaySpan.setAttribute("class","red-span"); }
            ( card.childNodes[1] === undefined ) ?
            ( card.appendChild(holidaySpan) ) :
            ( card.replaceChild(holidaySpan, card.childNodes[1] ) );

    }

    //插入事件列表label
    function insertEventSpan( eventHtml, card ) {
        let eventSpan = document.createElement("span");
        eventSpan.setAttribute("class", "event-span");
        eventSpan.innerHTML = eventHtml;
        if ( eventHtml === '需请假' ) { eventSpan.setAttribute("class","orange-span"); }
        if ( eventHtml === '晚到' ) { eventSpan.setAttribute("class","waning-span"); }
        if ( eventHtml !== "") {
            ( card.childNodes[2] === undefined ) ?
            ( card.appendChild(eventSpan) ) :
            ( card.replaceChild(eventSpan, card.childNodes[2] ) );
        }
    }

    //插入时间列表
    function insertTimeUl( week, card ) {
        let timeUl = document.createElement("ul");
            for ( let index = 0 ; index < 2; index++ ) {
                let li = document.createElement("li");
                li.innerHTML = "0"+(Math.round(Math.random()*8)+1) +":" + (Math.round(Math.random()*25)+10) +":" + Math.round(Math.random()*50+10);
                timeUl.appendChild(li);
            }
            if ( week !== 0 && week !== 6 ) {
                ( card.childNodes[3] === undefined ) ?
                 ( card.appendChild(timeUl) ) :
                 ( card.replaceChild(timeUl, card.childNodes[3] ) );
            }

    }


    //判断节假日、周末、工作日
    function judgeHoliday(date, week) {
        const holiday = {
            '01-01': '元旦',
            '02-14': '情人节',
            '03-08': '妇女节',
            '04-01': '愚人节',
            '05-01': '劳动节',
            '06-01': '儿童节',
            '07-01': '建党节',
            '08-01': '建军节',
            '09-10': '教师节',
            '10-01': '国庆节'
        };
        if ( holiday[date] !== undefined ) {
            return "节假日";
        } else if (week !== 0 && week !== 6) {
            return "工作日";
        } else {
            return "周末";
        }
    }
    //判断事件列表
    function judgeEvent( week ) {
        const event = {
            0: '需请假',
            1: '辛苦了!',
            2: '晚到'
        };
        if ( week !== 0 && week !== 6 ) {
            return event[Math.round(Math.random()*2)];
        } else {
            return "";
        }
    }





})();