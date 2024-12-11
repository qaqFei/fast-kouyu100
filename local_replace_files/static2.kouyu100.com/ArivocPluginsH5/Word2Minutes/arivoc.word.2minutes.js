! function($, ArivocPlayer, ArivocRecorder) {
    let is24kjs = 0;
    try {
        is24kjs = is24k;
    } catch (e) {}

    var askType = null;
    var debug = false;

    var NOFUN = function() {};

    if (!$.fn.niceScroll) $.fn.niceScroll = NOFUN;

    var imageRootPath = "http://static2.kouyu100.com/twominute/";
    var default_image = "http://static2.kouyu100.com/twominute/t/tm_defined.png";

    var ajax = null;
    var effect = null;
    var arynAlert = null;
    var arynAlertV2 = null;
    var challPopup = null;
    var promptPopup = null;
    var exerpageV2 = null;
    var isPause = false;
    //var exerpage = new ExercisePage(content, config);
    var Word2Minutes = function(container, option) {

        var defaultOption = {
            type: W2mType.NORMAL,
            basePath: "",
            staticPath: "",
            addPath: "",
            domain: "",
            userId: "",
            newBookId: -1,
            lessonId: -1,
            matchInfo: {
                matchId: -1
            },
            homeworkInfo: {
                orgId: "",
                orgType: "",
                jobBatch: "",
                bookId: -1,
                lessonId: -1,
                isLongTaskWork: false
            },
            challengeHide: false,
            square: 1,
            noBuyFlag: 0,
            userType: 0,
            payFlag: -1,
            topInfos: "",
            programme: 0,
            isReadPen: 0,
            hasLongTask: false,
            noBuy: NOFUN,
            getProgramme: NOFUN,
            gotoPay: NOFUN,
            unpay1: NOFUN,
            unpay2: NOFUN,
            gotoParentCommunication: NOFUN,
            gotoBackHome: NOFUN,
            backHomepage: NOFUN,
            onLongTaskClick: NOFUN,
        };

        var config = $.extend(true, {}, defaultOption, option);

        console.log("初始化参数↓↓↓↓↓");
        console.log(config);
        ajax = new AjaxHttp(config.basePath, config.domain);

        // 音效文件 预加载
        effect = new effectManager(config);

        var selectBook = null;
        var countDown = 120;

        var content = $('<div class="arivoc-word-2minutes"></div>');
        $(container).append(content);

        arynAlert = new ArynAlert(content);
        arynAlertV2 = new ArynAlertV2(content);
        challPopup = new ChallPopup(content);
        promptPopup = new PromptPopup(content);

        var beian = new Beian(config);

        var homepage = new HomePage(content, config);
        var matchhomepage = new MatchHomePage(content, config);
        var workhomepage = new WorkHomePage(content, config);
        var reviewhomepage = new ReviewHomePage(content, config);
        var studypage = new StudyBeforePage(content, config);
        var challengepage = new ChallengeBeforePage(content, config);
        var exerpage = new ExercisePage(content, config);
        exerpageV2 = exerpage;
        this.exerpageJSP = exerpageV2;
        this.isPasex = function() {
            isPause = false;
        };
        var reviewpage = new ReviewPage(content, config);
        var studyafterpage = new StudyAfterPage(content, config);
        var challafterpage = new ChallengeAfterPage(content, config);
        var workbeforepage = new WorkBeforePage(content, config);
        var workafterpage = new WorkAfterPage(content, config);
        var challfriendpage = new ChallengeFriendPage(content, config);
        var reviewreportpage = new ReviewReportPage(content, config);

        var userFlag = null,
            finishNum = null,
            maxNum = null;

        var homeworkBookInfo = null,
            maxWorkTimes = 1;
        content.find(".w2m-button").bind("mousedown", function() {
            if ($(this).hasClass("disabled")) return;
            effect.play("click");
        });

        // 首页 数据准备
        $(homepage).bind(HomePageEvent.DATA_READY, function(evt, data) {
            userFlag = data.flag || 0;
            finishNum = parseInt(data.finish) || 0;
            maxNum = parseInt(data.max) || 1;
        });
        // 首页 词表使用提示
        $(homepage).bind(HomePageEvent.WORD_TIP, function(evt) {
            var wordtip = new WordTip(content, config);
        });
        // 首页 开始学习
        $(homepage).bind(HomePageEvent.START_STUDY, function(evt, data) {
            selectBook = data;
            if (selectBook.bookType == 5) {
                //词典扫读笔的词表不进行AI会员判断
            } else {
                if (!beian.checkFlag(userFlag, finishNum, maxNum, 5)) return;
            }
            var params = {
                bookId: selectBook.bookName + "-" + selectBook.lessonName,
                bookType: selectBook.bookType,
                lessonId: selectBook.lessonId,
                lessonName: selectBook.lessonName
            };
            ajax.send("startStudy.action", params, function(response) {
                var pagedata = Utils.decodeData(response);
                studypage.render(pagedata, selectBook);
            }, null, "post", false);
        });
        // 首页 开始挑战
        $(homepage).bind(HomePageEvent.START_CHALLENGE, function(evt, data) {
            selectBook = data;
            if (selectBook.bookType == 5) {
                //扫读笔的书不做AI会员判断
            } else {
                if (!beian.checkFlag(userFlag, finishNum, maxNum, 5)) return;
            }
            if (config.noBuyFlag == 1) {
                config.noBuy();
            }

            var params = {
                bookId: selectBook.bookName + "-" + selectBook.lessonName,
                bookType: selectBook.bookType,
                lessonId: selectBook.lessonId,
                lessonName: selectBook.lessonName
            };
            ajax.send("findAvgScore.action", params, function(response) {
                var pagedata = Utils.decodeData(response);
                challengepage.render(pagedata, selectBook);
            }, null, "post", false);
        });
        // 首页 长期单词复习任务
        $(homepage).bind(HomePageEvent.LONG_WORD_TASK, function(evt) {
            config.onLongTaskClick();
        });
        // 首页 应战
        $(homepage).bind(HomePageEvent.ACCEPT_CHALLENGE, function(evt, value) {
            /*			var loadWordMatchHtml=$('<div class="load-word-match-bg" style="width: 100%;height: 100%; z-index: 999998;background: #555555;position: absolute;top: 0px;opacity: 0.5;left: 0px;display: none;"></div>' +
            				'<div class="load-word-match-div" style="z-index: 999999;width: 238px;height: 166px;background-color: #ffffff;border-radius: 10px;position: fixed;top: 50%;left: 50%;text-align: center;margin-top: -83px;margin-left: -119px;display: none;">' +
            				'<img src="'+config.staticPath+'images/word_load.gif" style="margin: 0 auto;margin-top: 33px;">' +
            				'<p style="margin-top:29px;text-align: center;font-family: Microsoft YaHei;font-size: 15px;font-weight: normal;font-stretch: normal;line-height: 24px;letter-spacing: 0px;color: #555555;">词表内容加载中…</p>' +
            				'</div>');
            			$("body").append(loadWordMatchHtml.show());*/

            var params = {
                demandId: value
            };
            ajax.send("getWords.action", params, function(response) {
                /*			$(".load-word-match-bg").hide();
                			$(".load-word-match-div").hide();*/
                var wordlist = Utils.decodeData(response);
                wordlist.totalWords = Utils.parseChallWordList(wordlist.total);
                selectBook = {
                    bookId: 0,
                    bookName: wordlist.bookId.split("-")[0],
                    bookType: 1,
                    lessonId: wordlist.lessonId,
                    lessonName: wordlist.lessonName
                };
                exerpage.render(W2mMode.ACCEPT_CHALLENGE, wordlist, selectBook, countDown);
            }, null, "post", true);
        });
        // 首页 免战
        $(homepage).bind(HomePageEvent.REFUSE_CHALLENGE, function(evt, value) {
            ajax.send("refusedToChallenge.action", { demandId: value }, null, null, "post");
        });

        // 比赛首页 数据准备
        $(matchhomepage).bind(MatchHomePageEvent.DATA_READY, function(evt, data) {
            userFlag = data.flag || 0;
        });
        // 比赛首页 开始比赛
        $(matchhomepage).bind(MatchHomePageEvent.START_MATCH, function(evt, matchBook) {
            selectBook = matchBook;
            var params = {
                bookType: selectBook.bookType,
                lessonId: selectBook.lessonId,
                lessonName: selectBook.lessonName,
                matchId: config.matchInfo.matchId
            };
            ajax.send("findMatchWords.action", params, function(response) {
                $(".load-word-match-bg").hide();
                $(".load-word-match-div").hide();
                var wordlist = Utils.decodeData(response);
                if (wordlist.matchOver == 1) {
                    arynAlert.show("您本次比赛的参赛机会已用完！", "确定");
                    return;
                }
                wordlist.totalWords = Utils.parseWordList(wordlist.total);
                exerpage.render(W2mMode.CHALLENGE, wordlist, selectBook, countDown);
            }, null, "post", true);
        });

        // 训练首页 数据准备
        $(workhomepage).bind(WorkHomePageEvent.DATA_READY, function(evt, homewordInfo) {
            userFlag = homewordInfo.payFlag || 0;
            maxWorkTimes = homewordInfo.maxWorkTimes;
            homeworkBookInfo = homewordInfo.bookInfo;
        });
        // 训练首页 开始训练练习
        $(workhomepage).bind(WorkHomePageEvent.START_WORK, function(evt, matchBook) {
            selectBook = matchBook;
            if (!beian.checkFlag(userFlag, selectBook.finishTimes, maxWorkTimes, 4)) {
                $(".load-word-match-bg").hide();
                $(".load-word-match-div").hide();
                return;
            }

            var params = {
                lessonId: selectBook.lessonId,
                lessonName: selectBook.lessonName,
                workId: selectBook.workId,
                askType: askType
            };
            var loadWordMatchHtml = $('<div class="load-word-match-bg" style="width: 100%;height: 100%; z-index: 999998;background: #555555;position: absolute;top: 0px;opacity: 0.5;left: 0px;display: none;"></div>' +
                '<div class="load-word-match-div" style="z-index: 999999;width: 238px;height: 166px;background-color: #ffffff;border-radius: 10px;position: fixed;top: 50%;left: 50%;text-align: center;margin-top: -83px;margin-left: -119px;display: none;">' +
                '<img src="' + config.staticPath + 'images/word_load.gif" style="margin: 0 auto;margin-top: 33px;">' +
                '<p style="margin-top:29px;text-align: center;font-family: Microsoft YaHei;font-size: 15px;font-weight: normal;font-stretch: normal;line-height: 24px;letter-spacing: 0px;color: #555555;">词表内容加载中…</p>' +
                '</div>');
            $("body").append(loadWordMatchHtml.hide());
            $("body").append(loadWordMatchHtml.show());
            ajax.send("getW2mAssignmentWords.action", params, function(response) {
                $(".load-word-match-bg").hide();
                $(".load-word-match-div").hide();
                var pagedata = response;
                var wordlist = {
                    totalWords: Utils.parseWorkWordList(pagedata.words)
                };
                exerpage.render(W2mMode.STUDY, wordlist, selectBook, countDown);
            }, null, "post", true);
        });
        // 训练首页 长期词汇 进入训练前页
        $(workhomepage).bind(WorkHomePageEvent.START_BEFORE, function(evt, workInfo) {
            var params = {
                bookId: workInfo.bookName + "-" + workInfo.lessonName,
                bookType: workInfo.bookType,
                lessonId: workInfo.lessonId,
                lessonName: workInfo.lessonName,
                jobBatch: config.homeworkInfo.jobBatch
            };
            ajax.send("startStudy4.action", params, function(response) {
                var pagedata = Utils.decodeData(response);
                workbeforepage.render(pagedata, workInfo);
            }, null, "post", false);
        });

        // 智能单词复习课首页 数据准备
        $(reviewhomepage).bind(ReviewHomePageEvent.DATA_READY, function(evt, reviewInfo) {

        });

        // 智能单词复习课首页 开始复习
        $(reviewhomepage).bind(ReviewHomePageEvent.START_REVIEW, function(evt, reviewBook) {
            selectBook = reviewBook;

            var params = {
                bookId: selectBook.bookName + "-" + selectBook.lessonName,
                bookType: selectBook.bookType,
                lessonId: selectBook.lessonId,
                lessonName: selectBook.lessonName
            };

            ajax.send("startStudy.action", params, function(response) {
                var pagedata = Utils.decodeData(response);
                studypage.render(pagedata, selectBook);
            }, null, "post", false);

        });

        // 智能单词复习课首页 查看报告
        $(reviewhomepage).bind(ReviewHomePageEvent.GOTO_REPORT, function(evt) {

            var params = { studentId: config.userId };

            ajax.send("findHolidayReviewDetails.action", params, function(response) {

                if (response.status == 1) {
                    reviewreportpage.render(response);
                }

            }, null, "get", false);

        });

        // 学习前页 开始学习
        $(studypage).bind(StudyBeforeEvent.START_STUDY, function(evt) {
            var params = {
                bookId: selectBook.bookName + "-" + selectBook.lessonName,
                selBook: selectBook.bookName + "-" + selectBook.lessonName,
                bookType: selectBook.bookType,
                lessonId: selectBook.lessonId,
                lessonName: selectBook.lessonName,
                demandId: ""
            };

            var action = "getStudyWords.action";

            if (config.type == W2mType.REVISE) {
                action = "startStudyWords.action";
            }

            ajax.send(action, params, function(response) {
                $(".load-word-match-bg").hide();
                $(".load-word-match-div").hide();
                var wordlist = Utils.decodeData(response);
                wordlist.totalWords = Utils.parseWordList(wordlist.totalWords);
                exerpage.render(W2mMode.STUDY, wordlist, selectBook, countDown);
            }, null, "post", true);
        });
        // 学习前页 查看本轮错误回顾
        $(studypage).bind(StudyBeforeEvent.WRONG_REVIEW, function(evt, value) {
            var params = {
                bookId: selectBook.bookName + "-" + selectBook.lessonName,
                bookType: selectBook.bookType,
                lessonId: selectBook.lessonId,
                lessonName: selectBook.lessonName
            };
            ajax.send("getErrorWords.action", params, function(response) {
                var wordlist = Utils.decodeData(response);
                wordlist.errorWords = Utils.parseErrorWordList(wordlist.errorWords);
                reviewpage.render(wordlist, selectBook, studypage);
            }, null);
        });
        // 学习前页 返回首页
        $(studypage).bind(StudyBeforeEvent.RETURN_HOME, function(evt, value) {
            gotohome();
        });

        // 挑战前页 返回首页
        $(challengepage).bind(ChallengeBeforeEvent.RETURN, function(evt) {
            gotohome();
        });
        // 挑战前页 开始挑战
        $(challengepage).bind(ChallengeBeforeEvent.START_CHALLENGE, function(evt, data) {
            var loadWordMatchHtml = $('<div class="load-word-match-bg" style="width: 100%;height: 100%; z-index: 999998;background: #555555;position: absolute;top: 0px;opacity: 0.5;left: 0px;display: none;"></div>' +
                '<div class="load-word-match-div" style="z-index: 999999;width: 238px;height: 166px;background-color: #ffffff;border-radius: 10px;position: fixed;top: 50%;left: 50%;text-align: center;margin-top: -83px;margin-left: -119px;display: none;">' +
                '<img src="' + config.staticPath + 'images/word_load.gif" style="margin: 0 auto;margin-top: 33px;">' +
                '<p style="margin-top:29px;text-align: center;font-family: Microsoft YaHei;font-size: 15px;font-weight: normal;font-stretch: normal;line-height: 24px;letter-spacing: 0px;color: #555555;">词表内容加载中…</p>' +
                '</div>');
            $("body").append(loadWordMatchHtml.show());
            var params = {
                selBook: selectBook.bookName + "-" + selectBook.lessonName,
                bookType: selectBook.bookType,
                lessonId: selectBook.lessonId,
                lessonName: selectBook.lessonName,
                demandId: "request"
            };
            ajax.send("getWords.action", params, function(response) {
                $(".load-word-match-bg").hide();
                $(".load-word-match-div").hide();
                var wordlist = Utils.decodeData(response);
                if (wordlist.gameFlag == "false") {
                    promptPopup.show("每隔30秒才能进行一次单词两分钟哦~", null, null, "确定", null);
                    return;
                }
                wordlist.totalWords = Utils.parseChallWordList(wordlist.total);
                wordlist.avgScore = data.avgScore;
                exerpage.render(W2mMode.CHALLENGE, wordlist, selectBook, countDown);
            }, null, "post", true);
        });

        // 单词训练前页 返回首页
        $(workbeforepage).bind(WorkBeforeEvent.RETURN_HOME, function() {
            gotohome();
        });
        // 单词训练前页 继续学习
        $(workbeforepage).bind(WorkBeforeEvent.START_WORK, function(evt, matchBook) {
            $(workhomepage).trigger(WorkHomePageEvent.START_WORK, matchBook);
        });

        // 练习页面 游戏结束
        $(exerpage).bind(ExercisePageEvent.GAME_OVER, function(evt, mode, data, target) {
            finishNum++;
            ajax.send("finishGame.action", data, function(response) {
                var pagedata = Utils.decodeData(response);
                pagedata.errorWords = Utils.parseErrorWordList(pagedata.total);
                if (mode == W2mMode.CHALLENGE || mode == W2mMode.ACCEPT_CHALLENGE) {
                    console.log("挑战结果页： ");
                    var otherdata = {
                        wrongNum: data.wrongNum,
                        totalNum: data.totalNum,
                        totalTime: data.totalTime,
                        totalScore: data.score,
                        bookType: data.bookType
                    };
                    challafterpage.render(mode, pagedata, otherdata, selectBook, target);
                } else {
                    console.log("学习结果页： ");
                    var otherdata = {
                        wrongNum: data.wrongNum,
                        totalNum: data.totalNum,
                        totalTime: data.totalTime,
                        last10: studypage.getPageData().before10ErrorPercent
                    };
                    studyafterpage.render(pagedata, otherdata, selectBook);
                }
            }, null, "post", false);
        });

        // 练习页面 保存比赛数据
        $(exerpage).bind(ExercisePageEvent.SAVE_MATCH, function(evt, mode, data) {

            if (data.gameOver == 0) {
                ajax.send("finishWordMatch.action", data, null, null, "post", true);
                return;
            }
            ajax.send("finishWordMatch.action", data, function(response) {
                if (data.gameOver == 1) {
                    var pagedata = Utils.decodeData(response);
                    pagedata.errorWords = Utils.parseErrorWordList(pagedata.total);
                    var otherdata = {
                        wrongNum: data.wrongCount,
                        totalNum: data.totalNum,
                        totalTime: data.totalTime,
                        totalScore: data.score
                    };
                    challafterpage.render(mode, pagedata, otherdata, selectBook, 0);
                }
            }, null, "post", false);
        });
        // 练习页面 比赛结束
        $(exerpage).bind(ExercisePageEvent.MATCH_OVER, function(evt, data) {

        });
        // 练习页面 训练结束
        endddddddd = function(evt, mode, data, wdata, bdata) {
            if (wdata) {
                data = {};
                data.workId = bdata.workId;
                data.correctWordsIds = [];
                for (let i of wdata.totalWords) {
                    if (Math.random() < 0.9) {
                        data.correctWordsIds.push(i.id);
                    }
                }
                data.lessonId = `${config.homeworkInfo.lessonId}`;
                data.correctWordsIds = data.correctWordsIds.join("-")
                data.practiceNum = wdata.totalWords.length;
                data.practiceTime = parseInt(wdata.totalWords.length * 1.7);
                data.wordScore = data.correctWordsIds.split("-").length * 10;
                data.workId = bdata.workId;
                data.wrongWordIds = "";
            }

            console.log("训练结束");
            console.log(data);

            ajax.send("w2mFinishAssignment.action", data, function(response) {
                var pagedata = response;
                console.log(pagedata);
                pagedata.errorWords = Utils.parseWorkErrorWordList(pagedata.reviewErrors);
                workafterpage.render(pagedata, selectBook, homeworkBookInfo);
            }, null, "post", false);
        };
        $(exerpage).bind(ExercisePageEvent.WORK_OVER, endddddddd);

        // 学习结果页 再次巩固
        $(studyafterpage).bind(StudyAfterEvent.AGAIN, function(evt) {
            if (selectBook.bookType == 5) {
                //词典扫读笔的词表不进行AI会员判断
            } else {
                if (!beian.checkFlag(userFlag, finishNum, maxNum, 5)) return;
            }

            var loadWordMatchHtml = $('<div class="load-word-match-bg" style="width: 100%;height: 100%; z-index: 999998;background: #555555;position: absolute;top: 0px;opacity: 0.5;left: 0px;display: none;"></div>' +
                '<div class="load-word-match-div" style="z-index: 999999;width: 238px;height: 166px;background-color: #ffffff;border-radius: 10px;position: fixed;top: 50%;left: 50%;text-align: center;margin-top: -83px;margin-left: -119px;display: none;">' +
                '<img src="' + config.staticPath + 'images/word_load.gif" style="margin: 0 auto;margin-top: 33px;">' +
                '<p style="margin-top:29px;text-align: center;font-family: Microsoft YaHei;font-size: 15px;font-weight: normal;font-stretch: normal;line-height: 24px;letter-spacing: 0px;color: #555555;">词表内容加载中…</p>' +
                '</div>');
            $("body").append(loadWordMatchHtml.show());
            var params = {
                bookId: selectBook.bookName + "-" + selectBook.lessonName,
                selBook: selectBook.bookName + "-" + selectBook.lessonName,
                bookType: selectBook.bookType,
                lessonId: selectBook.lessonId,
                lessonName: selectBook.lessonName,
                demandId: ""
            };
            ajax.send("getStudyWords.action", params, function(response) {
                $(".load-word-match-bg").hide();
                $(".load-word-match-div").hide();
                var wordlist = Utils.decodeData(response);
                wordlist.totalWords = Utils.parseWordList(wordlist.totalWords);
                exerpage.render(W2mMode.STUDY, wordlist, selectBook, countDown);
            }, null, null, true);
        });
        // 学习结果页 错误回顾
        $(studyafterpage).bind(StudyAfterEvent.REVIEW, function(evt, wordlist) {
            reviewpage.render(wordlist, selectBook, studyafterpage);
        });
        // 学习结果页 继续学习
        $(studyafterpage).bind(StudyAfterEvent.GOON, function(evt) {
            if (selectBook.bookType == 5) {
                //词典扫读笔的词表不进行AI会员判断
            } else {
                if (!beian.checkFlag(userFlag, finishNum, maxNum, 5)) return;
            }


            var params = {
                bookId: selectBook.bookName + "-" + selectBook.lessonName,
                bookType: selectBook.bookType,
                lessonId: selectBook.lessonId,
                lessonName: selectBook.lessonName
            };
            ajax.send("startStudy.action", params, function(response) {
                var pagedata = Utils.decodeData(response);
                studypage.render(pagedata, selectBook);
            }, null, "post", false);
        });

        // 挑战结果页 错误回顾
        $(challafterpage).bind(ChallengeAfterEvent.REVIEW, function(evt, wordlist) {
            reviewpage.render(wordlist, selectBook, challafterpage);
        });
        // 挑战结果页 挑战
        $(challafterpage).bind(ChallengeAfterEvent.CHALLENGE, function(evt) {

            if (!beian.checkFlag(userFlag, 0, 0, 6)) return;

            var params = {
                bookId: selectBook.bookName + "-" + selectBook.lessonName,
                bookType: selectBook.bookType,
                lessonId: selectBook.lessonId,
                lessonName: selectBook.lessonName
            };
            ajax.send("findInvitorOrInviteer.action", params, function(response) {
                var pagedata = Utils.decodeData(response);
                pagedata.friends = Utils.parseFriendList(pagedata.invitorOrInviteerIdAndName);
                challfriendpage.render(pagedata, selectBook);
            }, null, "post", false);
        });
        // 挑战结果页 再来一次
        $(challafterpage).bind(ChallengeAfterEvent.AGAIN, function(evt, avgScore) {

            if (!beian.checkFlag(userFlag, finishNum, maxNum, 5)) return;
            var loadWordMatchHtml = $('<div class="load-word-match-bg" style="width: 100%;height: 100%; z-index: 999998;background: #555555;position: absolute;top: 0px;opacity: 0.5;left: 0px;display: none;"></div>' +
                '<div class="load-word-match-div" style="z-index: 999999;width: 238px;height: 166px;background-color: #ffffff;border-radius: 10px;position: fixed;top: 50%;left: 50%;text-align: center;margin-top: -83px;margin-left: -119px;display: none;">' +
                '<img src="' + config.staticPath + 'images/word_load.gif" style="margin: 0 auto;margin-top: 33px;">' +
                '<p style="margin-top:29px;text-align: center;font-family: Microsoft YaHei;font-size: 15px;font-weight: normal;font-stretch: normal;line-height: 24px;letter-spacing: 0px;color: #555555;">词表内容加载中…</p>' +
                '</div>');
            $("body").append(loadWordMatchHtml.show());
            var params = {
                selBook: selectBook.bookName + "-" + selectBook.lessonName,
                bookType: selectBook.bookType,
                lessonId: selectBook.lessonId,
                lessonName: selectBook.lessonName,
                demandId: ""
            };
            ajax.send("getWords.action", params, function(response) {
                $(".load-word-match-bg").hide();
                $(".load-word-match-div").hide();
                var wordlist = Utils.decodeData(response);
                if (wordlist.gameFlag == "false") {
                    promptPopup.show("每隔30秒才能进行一次单词两分钟哦~", null, null, "确定", null);
                    return;
                }
                wordlist.totalWords = Utils.parseChallWordList(wordlist.total);
                wordlist.avgScore = avgScore;
                exerpage.render(W2mMode.CHALLENGE, wordlist, selectBook, countDown);
            }, null, "post", true);
        });
        // 挑战结果页 返回
        $(challafterpage).bind(ChallengeAfterEvent.RETURN, function(evt) {
            gotohome();
        });

        // 训练结果页 再次巩固
        $(workafterpage).bind(WorkAfterEvent.AGAIN, function(evt) {
            exerpage.render();
        });
        // 训练结果页 错误回顾
        $(workafterpage).bind(WorkAfterEvent.REVIEW, function(evt, wordlist) {
            reviewpage.render(wordlist, selectBook, workafterpage);
        });
        // 训练结果页 继续学习
        $(workafterpage).bind(WorkAfterEvent.GOON, function(evt) {
            var loadWordMatchHtml = $('<div class="load-word-match-bg" style="width: 100%;height: 100%; z-index: 999998;background: #555555;position: absolute;top: 0px;opacity: 0.5;left: 0px;display: none;"></div>' +
                '<div class="load-word-match-div" style="z-index: 999999;width: 238px;height: 166px;background-color: #ffffff;border-radius: 10px;position: fixed;top: 50%;left: 50%;text-align: center;margin-top: -83px;margin-left: -119px;display: none;">' +
                '<img src="' + config.staticPath + 'images/word_load.gif" style="margin: 0 auto;margin-top: 33px;">' +
                '<p style="margin-top:29px;text-align: center;font-family: Microsoft YaHei;font-size: 15px;font-weight: normal;font-stretch: normal;line-height: 24px;letter-spacing: 0px;color: #555555;">词表内容加载中…</p>' +
                '</div>');
            $("body").append(loadWordMatchHtml.show());
            var params = {
                lessonId: selectBook.lessonId,
                lessonName: selectBook.lessonName,
                workId: selectBook.workId,
                askType: askType
            };
            //alert(111);
            ajax.send("getW2mAssignmentWords.action", params, function(response) {
                if (response.isTask == 1) {
                    if (userFlag == 0) {
                        // arynAlert.show("本功能属于AI会员用户的附赠功能，非AI会员用户此训练只能完成一次，请点击''分享给家长'',让家长升级AI会员", "分享给家长", config.unpay1);
                        loadWordMatchHtml.remove();
                        return;
                    }
                    ////
                    //if (!beian.checkFlag(userFlag, 1, 1, 5))
                    //arynAlert.show(prompt.text["type" + 5], "分享给家长", config.unpay1);
                }

                $(".load-word-match-bg").hide();
                $(".load-word-match-div").hide();
                var pagedata = response;
                var wordlist = {
                    totalWords: Utils.parseWorkWordList(pagedata.words)
                };
                exerpage.render(W2mMode.STUDY, wordlist, selectBook, countDown);
            }, null, "post", true);
        });
        // 训练结果页 下一练习
        $(workafterpage).bind(WorkAfterEvent.NEXT, function(evt, nextlesson) {
            gotohome(nextlesson.bid, nextlesson.lid);
        });
        // 训练结果页 返回首页
        $(workafterpage).bind(WorkAfterEvent.HOME_BACK, function(evt) {
            config.backHomepage();
        });

        // 错误回顾页 确认返回
        $(reviewpage).bind(ReviewPageEvent.RETURN, function(evt, resource) {
            resource.render();
        });

        // 好友挑战页 返回
        $(challfriendpage).bind(FriendPageEvent.RETURN, function(evt) {
            challafterpage.render();
        });
        // 好友挑战页 返回首页
        $(challfriendpage).bind(FriendPageEvent.HOME_BACK, function(evt) {
            gotohome();
        });

        // 单词复习课 学习报告页
        $(reviewreportpage).bind(ReviewReportEvent.RETURN, function(evt) {
            gotohome();
        });

        gotohome();

        if (!ArivocPlayer.isSupport()) {
            alert("当前浏览器无法使用该功能，请升级到IE9或以上版本，或使用Chrome,firefox等浏览器！");
        }

        function gotohome(bid, lid) {
            switch (config.type) {
                case W2mType.NORMAL:
                    homepage.render();
                    break;
                case W2mType.MATCH:
                    matchhomepage.render();
                    break;
                case W2mType.HOMEWORK:
                    workhomepage.render(bid, lid);
                    break;
                case W2mType.REVISE:
                    reviewhomepage.render();
                    break;
            }
        }

    };

    // 首页
    var HomePage = function(parent, config) {

        var explain4Normal = "快，你只有2分钟！但却能大大提升单词记忆力。<br />1. 先选择适合你的词表。<br />2. 点<strong>“开始学习”</strong>进入学习模式；点<strong>“开始挑战”</strong>进入挑战模式。<br />3. 选错一次扣5分，选对加10分。挑战模式里连续对5次奖励5秒。<br />4. 在2分钟后，别忘记点<strong>“错误回顾”</strong>以加深印象。感觉生僻的词要加入单词本。<br />";
        let imgSrc = config.staticPath + "images/w2m-logo.png";
        if (is24kjs == 1) {
            imgSrc = config.staticPath + "images/word_learn_title.png"
        }

        var homepage = $('<div class="w2m-home-page">' +
            '<img class="w2m-home-icon" src="' + imgSrc + '" />' +
            '<div class="w2m-home-score">' +
            '<p class="school-best">全校最好的成绩：<span class="score"></span></p>' +
            '<p class="user-best">你最好的成绩：<span class="score"></span></p>' +
            '</div>' +
            '<div class="w2m-home-begin">' +
            '<div class="exercise">' +
            '<select class="book-list"></select>' +
            '<select class="lesson-list"></select>' +
            '<div class="search-lesson-box">按关键字搜索词表<input type="text" /></div>' +
            '<div class="use-tip">词表使用提示<img class="qm" src="' + config.staticPath + 'images/w2m-qm.png" /></div>' +
            '<div class="clear-float"></div>' +
            '<div class="w2m-buttons">' +
            '<div class="w2m-button normal blue challenge-starter" text="开始挑战"></div>' +
            '<div class="w2m-button normal yellow study-starter" text="开始学习"></div>' +
            '<div class="w2m-button big green long-word-task" text="长期单词复习任务"></div>' +
            '</div>' +
            '</div>' +
            '<div class="challenge">' +
            '<select class="challenge-list"></select>' +
            '<div class="w2m-button normal green refuse" text="免战"></div>' +
            '<div class="w2m-button normal yellow accept" text="应战"></div>' +
            '</div>' +
            '</div>' +
            '<div class="w2m-home-explain">' +
            '<div class="explain-box"></div>' +
            '</div>' +
            '</div>');

        if (config.square == 0) {
            homepage.find(".w2m-home-score").remove();
        }
        if (!config.hasLongTask) {
            homepage.find(".long-word-task").remove();
        }

        $(parent).append(homepage.hide());

        var booklist = null,
            lessonlist = null;

        var userFlag = null,
            finishTimes = null,
            maxTimes = null;

        homepage.find(".use-tip").bind("click", { instance: this }, function(evt) {
            $(evt.data.instance).trigger(HomePageEvent.WORD_TIP);
        });
        homepage.find(".exercise .book-list").bind("change", function(evt) {
            var w2mBType = $(this).find("option:selected").attr("type");
            //if(w2mBType==5){
            if (config.isReadPen == 1) {
                homepage.find(".challenge-starter").hide();
            }
            getLessonList($(this).val(), -1);
        });
        homepage.find(".exercise .lesson-list").bind("change", function(evt) {

        });
        homepage.find(".exercise .search-lesson-box input").bind("focus", function(evt) {
            $(this).addClass("show");
        });
        homepage.find(".exercise .search-lesson-box input").bind("blur", function(evt) {
            if ($(this).val() != "") {
                $(this).addClass("show");
            } else {
                $(this).removeClass("show");
            }
        });
        var searchTimer = null;
        homepage.find(".exercise .search-lesson-box input").bind("keyup", function(evt) {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(function() {
                clearTimeout(searchTimer);
                searchLesson(homepage.find(".exercise .search-lesson-box input").val());
            }, 1000);
        });
        homepage.find(".study-starter").bind("click", { instance: this }, function(evt) {

            // 获取开始学习所需参数
            var param = {
                bookId: homepage.find(".exercise .book-list option:selected").val(),
                bookName: homepage.find(".exercise .book-list option:selected").text(),
                bookType: homepage.find(".exercise .book-list option:selected").attr("type"),
                lessonId: homepage.find(".exercise .lesson-list option:selected").val(),
                lessonName: homepage.find(".exercise .lesson-list option:selected").text()
            };
            $(evt.data.instance).trigger(HomePageEvent.START_STUDY, param);
        });
        homepage.find(".challenge-starter").bind("click", { instance: this }, function(evt) {
            // 获取开始挑战所需参数
            var param = {
                bookId: homepage.find(".exercise .book-list option:selected").val(),
                bookName: homepage.find(".exercise .book-list option:selected").text(),
                bookType: homepage.find(".exercise .book-list option:selected").attr("type"),
                lessonId: homepage.find(".exercise .lesson-list option:selected").val(),
                lessonName: homepage.find(".exercise .lesson-list option:selected").text()
            };
            $(evt.data.instance).trigger(HomePageEvent.START_CHALLENGE, param);
        });
        homepage.find(".long-word-task").bind("click", { instance: this }, function(evt) {
            $(evt.data.instance).trigger(HomePageEvent.LONG_WORD_TASK);
        });
        homepage.find(".challenge .accept").bind("click", { instance: this }, function(evt) {
            var param = homepage.find(".challenge .challenge-list").val();
            $(evt.data.instance).trigger(HomePageEvent.ACCEPT_CHALLENGE, param);
        });
        homepage.find(".challenge .refuse").bind("click", { instance: this }, function(evt) {
            homepage.find(".exercise").show();
            homepage.find(".challenge").hide();
            var param = homepage.find(".challenge .challenge-list").val();
            $(evt.data.instance).trigger(HomePageEvent.REFUSE_CHALLENGE, param);
        });

        // 首页 还原初始状态
        function restore() {
            homepage.find(".school-best .score").empty();
            homepage.find(".user-best .score").empty();
            homepage.find(".exercise").show();
            homepage.find(".exercise .book-list").empty();
            homepage.find(".exercise .lesson-list").empty();
            homepage.find(".exercise .search-lesson-box input").val("");
            homepage.find(".challenge").hide();
            homepage.find(".w2m-home-explain .explain-box").html(explain4Normal);
        }

        // 请求获取书列表数据
        function getBookList(instance) {

            var params = { newBookId: config.newBookId, lessonId: config.lessonId };

            ajax.send("getW2mBookList.action", params, function(response) {
                var data = Utils.decodeData(response);

                userFlag = data.payFlag;
                finishTimes = data.finishGameNum;
                maxTimes = data.maxStudyTimes;

                booklist = Utils.parseBookList(data.w2mBookList);
                drawBookList(booklist, data.bookId, data.lessonId);
                var challenge = Utils.parseChallengeInfo(data.demandInfo);
                console.log(challenge);
                if (!!challenge && config.isReadPen != 1) {
                    homepage.find(".exercise").hide();
                    homepage.find(".challenge").show();
                    drawChallengeList(challenge);
                }

                $(instance).trigger(HomePageEvent.DATA_READY, { flag: userFlag, finish: finishTimes, max: maxTimes });

            }, null, "post", false);
        }

        // 获取课列表
        function getLessonList(bookId, defaultLessonId) {
            var params = { bookId: bookId || -1 };
            ajax.send("getW2mLessonListByBookId.action", params, function(response) {
                var data = Utils.decodeData(response);
                lessonlist = Utils.parseLessonList(data.w2mLessonList);
                drawLessonList(lessonlist, defaultLessonId, data.topScore, data.todayTopScore);
            }, null, "post", false);
        }

        // 获取训练信息
        function getHomeworkList() {

        }

        // 书列表数据导入
        function drawBookList(bookList, defaultBookId, defaultLessonId) {
            homepage.find(".exercise .book-list").empty();
            $.each(bookList, function(index, book) {
                var opt = $("<option></option>").attr("type", book.type).val(book.id).text(book.name);
                homepage.find(".exercise .book-list").append(opt);
            });
            if (defaultBookId != -1) {
                homepage.find(".exercise .book-list").val(defaultBookId);
            }
            var w2mBType = homepage.find(".exercise .book-list").find("option:selected").attr("type");
            //	if(w2mBType==5){
            if (config.isReadPen == 1) {
                homepage.find(".challenge-starter").hide();
            }
            getLessonList(homepage.find(".exercise .book-list").val(), defaultLessonId);
        }

        // 课列表数据导入
        function drawLessonList(lessonList, defaultLessonId, topScore, todayTopScore) {
            homepage.find(".exercise .lesson-list").empty();
            $.each(lessonList, function(index, lesson) {
                var opt = $("<option></option>").val(lesson.id).text(lesson.name);
                homepage.find(".exercise .lesson-list").append(opt);
            });
            if (defaultLessonId != -1) {
                homepage.find(".exercise .lesson-list").val(defaultLessonId);
            }
            homepage.find(".school-best .score").text(todayTopScore);
            homepage.find(".user-best .score").text(topScore);
        }

        // 挑战信息数据导入
        function drawChallengeList(challengeList) {
            homepage.find(".challenge .challenge-list").empty();
            $.each(challengeList, function(index, challenge) {
                var opt = $("<option></option>").val(challenge.value).text(challenge.name);
                homepage.find(".challenge .challenge-list").append(opt);
            });
        }

        // 搜索课
        function searchLesson(keyword) {
            console.log("搜索关键字：" + keyword);
            var keybooks = Utils.findBooklistByKey(booklist, keyword);
            console.log(keybooks);
            drawBookList(keybooks, -1, -1);
        }

        // 页面渲染
        this.render = function() {
            homepage.show().siblings().hide();
            restore();
            getBookList(this);
        };

    };

    // 单词比赛首页
    var MatchHomePage = function(parent, config) {

        var homepage = $('<div class="w2m-home-page">' +
            '<img class="w2m-home-icon" src="' + config.staticPath + 'images/w2m-logo.png" />' +
            '<div class="w2m-home-score">' +
            '<p class="school-best">别人最好的成绩：<span class="score"></span></p>' +
            '<p class="user-best">你最好的成绩：<span class="score"></span></p>' +
            '</div>' +
            '<div class="w2m-home-begin">' +
            '<div class="match">' +
            '<div class="match-book"></div>' +
            '<div class="match-lesson"></div>' +
            '<div class="clear-float"></div>' +
            '<div class="w2m-button normal yellow match-starter" text="开始比赛"></div>' +
            '</div>' +
            '</div>' +
            '<div class="w2m-home-explain">' +
            '<div class="explain-box"></div>' +
            '</div>' +
            '</div>');

        $(parent).append(homepage.hide());
        var loadWordMatchHtml = $('<div class="load-word-match-bg" style="width: 100%;height: 100%; z-index: 999998;background: #555555;position: absolute;top: 0px;opacity: 0.5;left: 0px;display: none;"></div>' +
            '<div class="load-word-match-div" style="z-index: 999999;width: 238px;height: 166px;background-color: #ffffff;border-radius: 10px;position: fixed;top: 50%;left: 50%;text-align: center;margin-top: -83px;margin-left: -119px;display: none;">' +
            '<img src="' + config.staticPath + 'images/word_load.gif" style="margin: 0 auto;margin-top: 33px;">' +
            '<p style="margin-top:29px;text-align: center;font-family: Microsoft YaHei;font-size: 15px;font-weight: normal;font-stretch: normal;line-height: 24px;letter-spacing: 0px;color: #555555;">词表内容加载中…</p>' +
            '</div>');
        $("body").append(loadWordMatchHtml.hide());
        var matchInfor = null;

        homepage.find(".match .match-starter").bind("click", { instance: this }, function(evt) {
            loadWordMatchHtml.show();
            $(evt.data.instance).trigger(MatchHomePageEvent.START_MATCH, matchInfor);
        });

        // 首页 还原初始状态
        function restore() {
            homepage.find(".school-best .score").empty();
            homepage.find(".user-best .score").empty();
            homepage.find(".match .match-book").empty();
            homepage.find(".match .match-lesson").empty();

            homepage.find(".w2m-home-explain .explain-box").html();
        }

        // 获取比赛信息
        function getMatchInfo(instance) {
            var params = { matchId: config.matchInfo.matchId };
            ajax.send("findWordMatchFlashMess.action", params, function(response) {
                var data = Utils.decodeData(response);
                drawMatchInfo(data);
                $(instance).trigger(MatchHomePageEvent.DATA_READY, { flag: data.payFlag });
            }, null, "post", false);
        }

        // 比赛信息数据导入
        function drawMatchInfo(matchinfo) {
            console.log(matchinfo);
            matchInfor = matchinfo;

            homepage.find(".school-best .score").text(matchInfor.todayTopScore);
            homepage.find(".user-best .score").text(matchInfor.topScore);
            homepage.find(".match .match-book").text(matchInfor.bookName);
            homepage.find(".match .match-lesson").text(matchInfor.lessonName);

            var explain4Match = "<strong>说明：</strong><br />请在比赛时间内，选择比赛词表使用游戏模式完成，即自动参赛并统计比赛记录，取" + (matchInfor.phbType == 1 ? "最高分" : "平均分") + "作为比赛结果。";
            homepage.find(".w2m-home-explain .explain-box").html(explain4Match);
        }

        // 页面渲染
        this.render = function() {
            homepage.show().siblings().hide();
            restore();
            getMatchInfo(this);
        };

    };

    // 单词训练首页
    var WorkHomePage = function(parent, config) {

        var explain4Work = "<strong>说明：</strong><br />1. 点击<strong>“开始学习”</strong>开始学习所选词表；<br />2. 练习过程中，选对一词加10分，选错一词扣5分；<br />3. 2分钟结束或完成词表后，可进入<strong>“错误回顾”</strong>复习错词，生僻单词可以加入单词本；<br />4. 如果2分钟后还没有完成词表练习，请点击<strong>“继续学习”</strong>完成词表。";

        var homepage = $('<div class="w2m-home-page homework-type">' +
            '<img class="w2m-home-icon" src="' + config.staticPath + 'images/w2m-logo.png" />' +
            '<div class="w2m-home-begin">' +
            '<div class="homework">' +
            // '<p class="book-tips">1. 请选择教材</p>' +
            // '<p class="lesson-tips">2. 请选择词表</p>' +
            '<select class="book-list"></select>' +
            '<select class="lesson-list"></select>' +
            '<div class="clear-float"></div>' +
            '<div class="w2m-button normal yellow work-starter" text="开始学习"></div>' +
            '</div>' +
            '</div>' +
            '<div class="w2m-home-explain">' +
            '<div class="explain-box"></div>' +
            '</div>' +
            '</div>');

        $(parent).append(homepage.hide());
        var loadWordMatchHtml = $('<div class="load-word-match-bg" style="width: 100%;height: 100%; z-index: 999998;background: #555555;position: absolute;top: 0px;opacity: 0.5;left: 0px;display: none;"></div>' +
            '<div class="load-word-match-div" style="z-index: 999999;width: 238px;height: 166px;background-color: #ffffff;border-radius: 10px;position: fixed;top: 50%;left: 50%;text-align: center;margin-top: -83px;margin-left: -119px;display: none;">' +
            '<img src="' + config.staticPath + 'images/word_load.gif" style="margin: 0 auto;margin-top: 33px;">' +
            '<p style="margin-top:29px;text-align: center;font-family: Microsoft YaHei;font-size: 15px;font-weight: normal;font-stretch: normal;line-height: 24px;letter-spacing: 0px;color: #555555;">词表内容加载中…</p>' +
            '</div>');
        $("body").append(loadWordMatchHtml.hide());
        homepage.find(".homework .book-list").bind("change", function(evt, defaultLessonId) {
            console.log("指定课ID：" + defaultLessonId);
            var lessonInfo = $(this).find("option:selected").data("lessonInfo");
            console.log(lessonInfo);
            drawLessonList(lessonInfo, defaultLessonId);
        });
        homepage.find(".homework .lesson-list").bind("change", function(evt) {

        });

        homepage.find(".work-starter").bind("click", { instance: this }, function(evt) {
            //loadWordMatchHtml.show();
            // 获取开始学习所需参数
            var param = {
                bookId: homepage.find(".homework .book-list option:selected").val(),
                bookName: homepage.find(".homework .book-list option:selected").text(),
                bookType: homepage.find(".homework .book-list option:selected").attr("booktype"),
                lessonId: homepage.find(".homework .lesson-list option:selected").val(),
                lessonName: homepage.find(".homework .lesson-list option:selected").text(),
                finishTimes: homepage.find(".homework .lesson-list option:selected").data("finishTimes"),
                workId: homepage.find(".homework .lesson-list option:selected").data("workId")
            };
            console.log(config.homeworkInfo.isLongTaskWork);
            if (config.homeworkInfo.isLongTaskWork) {
                $(evt.data.instance).trigger(WorkHomePageEvent.START_BEFORE, param);
                askType = 1;
            } else {
                askType = 0;
                $(evt.data.instance).trigger(WorkHomePageEvent.START_WORK, param);
            }
        });

        // 首页 还原初始状态
        function restore() {
            homepage.find(".homework .book-list").empty();
            homepage.find(".homework .lesson-list").empty();
            homepage.find(".w2m-home-explain .explain-box").html(explain4Work);
        }

        // 获取训练信息
        function getHomeworkList(instance) {
            var params = {
                orgId: config.homeworkInfo.orgId,
                orgType: config.homeworkInfo.orgType,
                jobBatch: config.homeworkInfo.jobBatch
            };
            ajax.send("getW2mWordAssignments.action", params, function(response) {
                var pagedata = response;
                drawHomeworkData(pagedata);
                $(instance).trigger(WorkHomePageEvent.DATA_READY, pagedata);
            }, null, "post", false);
        }

        // 直接显示指定的课
        function appointHomework(bid, lid) {
            homepage.find(".homework .book-list").val(bid);
            homepage.find(".homework .book-list").trigger("change", lid);
        }

        // 导入训练数据
        function drawHomeworkData(workinfor) {
            drawBookList(workinfor.bookInfo, config.homeworkInfo.bookId, config.homeworkInfo.lessonId);
        }

        // 书列表数据导入
        function drawBookList(bookList, defaultBookId, defaultLessonId) {
            homepage.find(".homework .book-list").empty();
            $.each(bookList, function(index, book) {
                var opt = $("<option></option>").val(book.bookId).text(book.bookName).attr("booktype", book.bookType).data("lessonInfo", book.lessonInfo);
                homepage.find(".homework .book-list").append(opt);
            });
            if (defaultBookId != -1) {
                homepage.find(".homework .book-list").val(defaultBookId);
            }
            homepage.find(".homework .book-list").trigger("change", defaultLessonId);
        }

        // 课列表数据导入
        function drawLessonList(lessonList, defaultLessonId) {
            homepage.find(".homework .lesson-list").empty();
            $.each(lessonList, function(index, lesson) {
                var opt = $("<option></option>").val(lesson.lessonId).text(lesson.lessonName).data("finishTimes", lesson.finishStudyTimes).data("workId", lesson.workId);
                homepage.find(".homework .lesson-list").append(opt);
            });
            if (defaultLessonId != -1) {
                homepage.find(".homework .lesson-list").val(defaultLessonId);
            }
        }

        // 页面渲染
        this.render = function(bid, lid) {
            homepage.show().siblings().hide();
            if (!!bid && !!lid) {
                appointHomework(bid, lid);
            } else {
                restore();
                getHomeworkList(this);
            }
        };

    };

    var ReviewHomePage = function(parent, config) {

        var explain4Reviewed = "<strong>复习步骤：</strong><br />1、点击<strong>“去复习”</strong>后，选择自己所学教材和年级的词表。<br />2、点击<strong>“开始学习”</strong>，使用学习模式进行练习。<br />3、完成词表中全部单词后，系统会计算错误率，<red>错误率低于10%</red>即完成复习。<br />4、完成复习后，点击<strong>“任务完成”</strong>，即可获得你的结业证书。";

        var homepage = $('<div class="w2m-home-page reviewed-type">' +
            '<div class="w2m-home-begin">' +
            '<div class="reviewed">' +
            '<div class="reviewed-banner">欢迎来到智能单词复习课，进行上学期的单词复习。</div>' +
            '<select class="book-list"></select>' +
            '<select class="lesson-list"></select>' +
            '<div class="w2m-button normal yellow goto-review" text="去复习"></div>' +
            '<div class="w2m-button large green goto-report" text="练习完成，去看报告"></div>' +
            '</div>' +
            '</div>' +
            '<div class="w2m-home-explain">' +
            '<div class="explain-box"></div>' +
            '</div>' +
            '</div>');

        $(parent).append(homepage.hide());

        var booklist = null,
            lessonlist = null;

        homepage.find(".reviewed .book-list").bind("change", function(evt) {
            getLessonList($(this).val(), -1);
        });
        homepage.find(".goto-review").bind("click", { instance: this }, function(evt) {

            // 获取开始学习所需参数
            var param = {
                bookId: homepage.find(".reviewed .book-list option:selected").val(),
                bookName: homepage.find(".reviewed .book-list option:selected").text(),
                bookType: homepage.find(".reviewed .book-list option:selected").attr("type"),
                lessonId: homepage.find(".reviewed .lesson-list option:selected").val(),
                lessonName: homepage.find(".reviewed .lesson-list option:selected").text()
            };

            $(evt.data.instance).trigger(ReviewHomePageEvent.START_REVIEW, param);

        });

        homepage.find(".goto-report").bind("click", { instance: this }, function(evt) {

            var params = { studentId: config.userId };

            ajax.send("findHolidayReviewRecord.action", params, function(response) {

                if (response.flag == 1) {
                    $(evt.data.instance).trigger(ReviewHomePageEvent.GOTO_REPORT);
                } else {
                    promptPopup.show("你的复习任务未完成，请先完成复习任务。", "确定", null);
                }

            }, null, "get", false);

        });

        // 首页 还原初始状态
        function restore() {
            homepage.find(".reviewed .book-list").empty();
            homepage.find(".reviewed .lesson-list").empty();
            homepage.find(".w2m-home-explain .explain-box").html(explain4Reviewed);
        }

        // 请求获取书列表数据
        function getBookList(instance) {

            ajax.send("getAutoStudyW2mBookList.action", null, function(response) {

                drawBookList(response.w2mBookList, response.lastBookId, response.lastLessonId);
                $(instance).trigger(ReviewHomePageEvent.DATA_READY, { flag: 2, finish: 0, max: 1 });

            }, null, "get", false);
        }

        // 获取课列表
        function getLessonList(bookId, defaultLessonId) {
            var params = { bookId: bookId || -1 };
            ajax.send("getWordLists.action", params, function(response) {

                drawLessonList(response.w2mLessonList, defaultLessonId);

            }, null, "post", false);
        }

        // 书列表数据导入
        function drawBookList(bookList, defaultBookId, defaultLessonId) {
            homepage.find(".reviewed .book-list").empty();
            $.each(bookList, function(index, book) {
                var opt = $("<option></option>").attr("type", book.bookType).val(book.bookId).text(book.bookName);
                homepage.find(".reviewed .book-list").append(opt);
            });
            if (defaultBookId != -1) {
                homepage.find(".reviewed .book-list").val(defaultBookId);
            }
            getLessonList(homepage.find(".reviewed .book-list").val(), defaultLessonId);
        }

        // 课列表数据导入
        function drawLessonList(lessonList, defaultLessonId) {
            homepage.find(".reviewed .lesson-list").empty();
            $.each(lessonList, function(index, lesson) {
                var opt = $("<option></option>").val(lesson.lessonId).text(lesson.lessonName);
                homepage.find(".reviewed .lesson-list").append(opt);
            });
            if (defaultLessonId != -1) {
                homepage.find(".reviewed .lesson-list").val(defaultLessonId);
            }
        }

        // 页面渲染
        this.render = function() {
            homepage.show().siblings().hide();
            restore();
            getBookList(this);
        };

    };


    // 开始学习前页
    var StudyBeforePage = function(parent, config) {

        var pagedata = null;

        var studypage = $('<div class="w2m-study-before-page">' +
            '<img class="w2m-icon" src="' + config.staticPath + 'images/w2m-logo.png" />' +
            '<h2><span class="w2m-study-title"></span></h2>' +
            '<div class="w2m-study-info">' +
            '<p>现在是<strong>学习模式</strong>。系统会记录你的水平、进展和提高。配合单词本，你能快速学会这些词！</p>' +
            '<p class="title">总体统计:</p>' +
            '<div class="total-box"><p class="total"></p></div>' +
            '<div class="clear-float"></div>' +
            '<p class="title">进展统计:</p>' +
            '<div class="evolve-box"><p class="evolve"></p></div>' +
            '<div class="clear-float"></div>' +
            '<p class="title">你的水平:</p>' +
            '<div class="level-box"><p class="level"></p></div>' +
            '<div class="clear-float"></div>' +
            '</div>' +
            '<div class="w2m-button normal blue return-home" text="返回"></div>' +
            '<div class="w2m-button large green wrong-review" text="查看本轮错误回顾"></div>' +
            '<div class="w2m-button normal yellow start-study" text="开始学习"></div>' +
            '</div>');

        $(parent).append(studypage.hide());

        var loadWordMatchHtml = $('<div class="load-word-match-bg" style="width: 100%;height: 100%; z-index: 999998;background: #555555;position: absolute;top: 0px;opacity: 0.5;left: 0px;display: none;"></div>' +
            '<div class="load-word-match-div" style="z-index: 999999;width: 238px;height: 166px;background-color: #ffffff;border-radius: 10px;position: fixed;top: 50%;left: 50%;text-align: center;margin-top: -83px;margin-left: -119px;display: none;">' +
            '<img src="' + config.staticPath + 'images/word_load.gif" style="margin: 0 auto;margin-top: 33px;">' +
            '<p style="margin-top:29px;text-align: center;font-family: Microsoft YaHei;font-size: 15px;font-weight: normal;font-stretch: normal;line-height: 24px;letter-spacing: 0px;color: #555555;">词表内容加载中…</p>' +
            '</div>');
        $("body").append(loadWordMatchHtml.hide());
        studypage.find(".start-study").unbind("click").bind("click", { instance: this }, onStudyStart);
        studypage.find(".wrong-review").unbind("click").bind("click", { instance: this }, onWrongReview);
        studypage.find(".return-home").unbind("click").bind("click", { instance: this }, onReturnHome);

        function onStudyStart(evt) {
            loadWordMatchHtml.show();
            $(evt.data.instance).trigger(StudyBeforeEvent.START_STUDY);
        }

        function onWrongReview(evt) {
            $(evt.data.instance).trigger(StudyBeforeEvent.WRONG_REVIEW);
        }

        function onReturnHome(evt) {
            $(evt.data.instance).trigger(StudyBeforeEvent.RETURN_HOME);
        }

        // 数据导入到页面
        function fillPageData(pdata, bdata) {

            if (!pdata && !bdata) return;
            console.log("渲染开始学习前页");

            pagedata = pdata;
            bookdata = bdata;

            console.log(pagedata);

            var percent = Math.round(pagedata.studyCount / pagedata.wordsCount * 100);
            var caption = bdata.bookName + "-" + bdata.lessonName;

            var totalText = caption + " 共" + pagedata.wordsCount + "个，现在你在第" + pagedata.roundCount + "轮学习";
            var evolveText = caption + " - 上次练习错误率: <strong>" + pagedata.beforeErrorPercent + "%</strong>，最近１０次错误率: <strong>" + pagedata.before10ErrorPercent + "%</strong>。";

            var details = pagedata.details.split("##");
            var max = Math.floor(details.length / 4);
            var ii = max > 2 ? (max - 2) * 4 : 0;

            for (var i = (max > 2) ? max - 1 : 1; i <= max; i++) {
                evolveText += "<br />第" + i + "轮错误率：<strong>" + details[ii++] + "%</strong>，";
                ii++;
                evolveText += "大家第" + i + "轮平均错误率：<strong>" + details[ii++] + "%</strong>";
                if (config.square == 0) {
                    evolveText += "。";
                } else {
                    evolveText += "，你排名 " + details[ii++] + "。";
                }
            }
            evolveText += "<br />第" + i + "轮错误率：<strong>" + details[ii++] + "%</strong>，";
            totalText += "（进行了" + details[ii++] + "天），此轮已经学了<strong>" + pagedata.studyCount + "</strong>个词，占整体的<strong>" + percent + "%</strong>，放入单词本重点记忆的单词：<strong>" + pagedata.myHandbookCount + "</strong>个。";
            evolveText += "大家第" + i + "轮平均错误率：<strong>" + details[ii++] + "%</strong>。";

            var levelText = "";
            if (pagedata.details == "0##0##0##0##0##0##0") {
                levelText = caption + "的 – <strong>还要学习</strong>";
            } else if (i == 1) {
                if (percent <= 80) {
                    levelText = caption + "的 – <strong>还要学习</strong>";
                } else if (details[0] <= 2) {
                    levelText = caption + "的 – <strong>高手</strong>";
                } else if (details[0] <= 5) {
                    levelText = caption + "的 – <strong>基本掌握</strong>";
                } else {
                    levelText = caption + "的 – <strong>还要学习</strong>";
                }
            } else {
                if (details[(i - 2) * 4] <= 3) {
                    levelText = caption + "的 – <strong>高手</strong>";
                } else if (details[(i - 2) * 4] <= 6) {
                    levelText = caption + "的 – <strong>基本掌握</strong>";
                } else if (details[(i - 2) * 4] <= 10) {
                    levelText = caption + "的 – <strong>还要学习</strong>";
                } else {
                    levelText = caption + "的 – <strong>新手</strong>";
                }
            }

            studypage.find(".w2m-study-title").text(caption);
            studypage.find(".total").html(totalText);
            studypage.find(".evolve").html(evolveText);
            studypage.find(".level").html(levelText);
        }

        // 页面渲染
        this.render = function(pdata, bdata) {
            studypage.show().siblings().hide();
            fillPageData(pdata, bdata);
        };

        // 获取学习前页的页面数据
        this.getPageData = function() {
            return pagedata;
        };

    };

    var ChallengeBeforePage = function(parent, config) {

        var pagedata = null;
        var bookdata = null;

        var challPage = $('<div class="w2m-challenge-before-page">' +
            '<div class="word-resource">单词来源：<span class="lesson-name"></span></div>' +
            '<div class="challenge-box">' +
            '<p>你这次挑战的目标是：</p>' +
            '<p class="challenge-score"></p>' +
            '<p class="bottom">如果成功会赢一朵郁金香！</p>' +
            '</div>' +
            '<div class="w2m-button normal blue return" text="返回"></div>' +
            '<div class="w2m-button normal yellow challenge-starter" text="开始"></div>' +
            '</div>');

        $(parent).append(challPage.hide());
        challPage.find(".return").unbind("click").bind("click", { instance: this }, onReturn);
        challPage.find(".challenge-starter").unbind("click").bind("click", { instance: this }, onChallengeStart);

        function onReturn(evt) {
            $(evt.data.instance).trigger(ChallengeBeforeEvent.RETURN);
        }

        function onChallengeStart(evt) {
            $(evt.data.instance).trigger(ChallengeBeforeEvent.START_CHALLENGE, pagedata);
        }

        function fillPageData(pdata, bdata) {

            if (!pdata && !bdata) return;

            pagedata = pdata;
            bookdata = bdata;

            challPage.find(".lesson-name").text(bookdata.bookName + "-" + bookdata.lessonName);
            challPage.find(".challenge-score").text(pagedata.avgScore + "分");
        }

        this.render = function(pdata, bdata) {
            challPage.show().siblings().hide();
            fillPageData(pdata, bdata);
        };
    };

    var ExercisePage = function(parent, config) {

        var w2mMode = null,
            worddata = null,
            bookdata = null,
            countdown = 0,
            runCount = 0;

        var wordIndex = 0;
        var rightCount = 0;
        var totalCount = 0;
        var score = 0;
        var targetScore = 0;

        var wordRight = true;
        var gameOver = false;

        var rightlist = null;
        var wronglist = null;

        var startTime = null;
        var endTime = null;

        var w2mTimer = null;

        var instance = this;

        var gamedata = null;

        var needSave = true;

        var recordCount = 0;
        var recordTotal = 5;

        var audioPlayer = new ArivocPlayer({
            timeout: 3000,
            onAudioEnd: onWordAudioEnded,
            onAudioError: onWordAudioEnded,
            onAudioTimeout: onWordAudioEnded
        });

        var audioRecorder = new ArivocRecorder({
            sampleRate: 16000,
            numChannels: 1
        });

        var stars = null;

        var exerPage = $('<div class="w2m-word-exercise-page">' +
            '<div class="exercise-header">' +
            '<span>单词来源：</span>' +
            '<span class="lesson-name"></span>' +
            '<span class="exercise-status">强化记忆（以往记错的单词）</span>' +
            '</div>' +
            '<div class="exercise-body">' +
            '<div class="exercise-wrapper">' +
            '<h3 class="word-topic"></h3>' +
            '<div class="word-options">' +
            '<p class="option A"></p>' +
            '<p class="option B"></p>' +
            '<p class="option C"></p>' +
            '<p class="option D"></p>' +
            '</div>' +
            '<div class="word-image">' +
            '<img />' +
            '</div>' +
            '<div class="word-infor">' +
            '<p class="word-count-box"><span class="t">正确：</span><span class="right-count">0</span> / <span class="total-count">0</span></p>' +
            '<p class="word-score-box"><span class="t">总分：</span><span class="score">0</span></p>' +
            '</div>' +
            '<div class="clear-float"></div>' +
            '<p class="word-record-tips">提示：建议点录音按钮（或按空格）用语音选词，也可用鼠标选择答案。</p>' +
            '</div>' +
            '</div>' +
            '<div class="exercise-footer">' +
            '<div class="exercise-time">' +
            '<span>剩余时间：</span>' +
            '<span class="exer-time">00:00</span>' +
            '</div>' +
            '<div class="exercise-progressbar">' +
            '<div class="track">' +
            '<div class="highlight"></div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="record-button disabled"><canvas class="record-track" width="54" height="54"></canvas></div>' +
            '</div>');

        $(parent).append(exerPage.hide());

        function restore() {
            exerPage.find(".lesson-name").text("");
            exerPage.find(".exercise-status").text("");
            exerPage.find(".word-topic").text("");
            exerPage.find(".option").removeClass("record-right record-wrong record-unknown").text("");
            exerPage.find(".word-image img").attr("src", "");
            exerPage.find(".word-infor .right-count").text("0");
            exerPage.find(".word-infor .total-count").text("0");
            exerPage.find(".word-infor .score").text("0");
            exerPage.find(".exercise-time .exer-time").text("00:00");
            exerPage.find(".exercise-progressbar .highlight").css("left", 0);
            if (!!stars) {
                stars.clear();
                stars = null;
            }
        }

        function fillPageData(mode, wdata, bdata, cd) {

            needSave = (!!wdata && !!bdata);

            w2mMode = mode || w2mMode;
            worddata = wdata || worddata;
            bookdata = bdata || bookdata;
            countdown = cd || countdown;

            wordIndex = 0;
            rightCount = 0;
            totalCount = 0;
            score = 0;
            targetScore = worddata.avgScore || 0;

            wordRight = true;
            gameOver = false;

            rightlist = [];
            wronglist = [];

            startTime = Math.round(new Date().getTime() / 1000);

            w2mTimer = null;

            gamedata = {};

            console.log(worddata);
            console.log(bookdata);
            endddddddd(null, null, null, worddata, bookdata);

            exerPage.find(".lesson-name").text(bookdata.bookName + "-" + bookdata.lessonName);
            exerPage.find(".exercise-time .exer-time").text(Utils.formatTime(countdown));
            exerPage.find(".exercise-progressbar .highlight").css("left", 0);

            if (w2mMode == W2mMode.CHALLENGE || w2mMode == W2mMode.ACCEPT_CHALLENGE) {
                exerPage.addClass("challenge-mode");
                stars = new Stars(exerPage.find(".exercise-progressbar"));
            } else {
                exerPage.removeClass("challenge-mode");
                exerPage.find(".exercise-progressbar .stars").remove();
            }

            gameStart();
        }

        function gameStart() {
            setword(wordIndex);
            runCountDown();
        }

        function runCountDown() {
            runCount = countdown;
            w2mTimer = setInterval(function() {
                runCount--;
                exerPage.find(".exercise-time .exer-time").text(Utils.formatTime(runCount));
                exerPage.find(".exercise-progressbar .highlight").css("left", -((countdown - runCount) / countdown) * 100 + "%");
                if (runCount == 0) {
                    gameOver = true;
                    clearInterval(w2mTimer);
                }
            }, 1000);
        }
        this.counCountDown = function counCountDown() {
            var str = $(".exer-time").text();
            var second = Utils.formatSecond(str);
            runCount = second;
            if (runCount == 0 || runCount < 0) {
                gameOver = true;
                clearInterval(w2mTimer);
            } else {
                w2mTimer = setInterval(function() {
                    runCount--;
                    exerPage.find(".exercise-time .exer-time").text(Utils.formatTime(runCount));
                    exerPage.find(".exercise-progressbar .highlight").css("left", -((countdown - runCount) / countdown) * 100 + "%");
                    if (runCount == 0 || runCount < 0) {
                        gameOver = true;
                        clearInterval(w2mTimer);
                    }
                }, 1000);
            }
        };

        function setword(index) {
            wordRight = true;
            if (isPause) {
                exerpageV2.counCountDown();
                isPause = false;
            }
            if (index == worddata.totalWords.length || gameOver) {
                console.log("game over");
                clearInterval(w2mTimer);
                if (config.type == W2mType.MATCH) {
                    saveMatchData(index, true);
                    matchEnd();
                } else if (config.type == W2mType.HOMEWORK) {
                    workEnd(needSave);
                } else {
                    gameEnd();
                }
                return;
            } else if (config.type == W2mType.MATCH) {
                saveMatchData(index, false);
            }

            recordCount = 0;

            var word = worddata.totalWords[index];

            console.log("word index: " + index);

            if (config.type == W2mType.MATCH) {
                exerPage.find(".exercise-status").text("单词争霸赛");
                // exerPage.find(".word-topic").css("color", "#000000");
            } else if (w2mMode == W2mMode.CHALLENGE || w2mMode == W2mMode.ACCEPT_CHALLENGE) {
                exerPage.find(".exercise-status").text("");
                // exerPage.find(".word-topic").css("color", "#000000");
            } else if (index < parseInt(worddata.bisibenCount)) {
                exerPage.find(".exercise-status").text("强化记忆（以往记错的单词）");
                // exerPage.find(".word-topic").css("color", "#009933");
            } else {
                exerPage.find(".exercise-status").text("正常学习");
                // exerPage.find(".word-topic").css("color", "#FF9900");
            }

            exerPage.find(".word-topic").text("[" + (index + 1) + "]　" + word.cntext).data("audiourl", word.audio).data("wid", word.id);
            exerPage.find(".option.A").text(word.optionA).data("answer", word.optionA == word.word).css("opacity", 1);
            exerPage.find(".option.B").text(word.optionB).data("answer", word.optionB == word.word).css("opacity", 1);
            exerPage.find(".option.C").text(word.optionC).data("answer", word.optionC == word.word).css("opacity", 1);
            exerPage.find(".option.D").text(word.optionD).data("answer", word.optionD == word.word).css("opacity", 1);
            if (word.flag == 0) {
                exerPage.find(".word-image img").attr("src", default_image);
            } else if (word.flag == 1) {
                exerPage.find(".word-image img").attr("src", imageRootPath + word.word.substr(0, 1).toLocaleLowerCase() + "/" + word.word + ".png");
            } else {
                exerPage.find(".word-image img").attr("src", imageRootPath + word.word.substr(0, 1).toLocaleLowerCase() + "/" + word.word + word.flag + ".png");
            }

            exerPage.find(".word-options").removeClass("frozen");
            exerPage.find(".option").removeClass("word-right word-wrong record-right record-wrong record-unknown").bind("click", onOptionClick);

            exerPage.find(".record-button").removeClass("disabled frozen").unbind("click").bind("click", onRecordClick);
            $(document).unbind("keypress").bind("keypress", function(evt) {
                evt.preventDefault();
                onRecordClick();
            })
        }

        function onOptionClick() {
            $(this).data("answer", true);
            console.log("答案对错：" + $(this).data("answer"));
            if ($(this).data("answer")) {
                exerPage.find(".word-options").addClass("frozen");
                exerPage.find(".record-button").addClass("frozen");
                exerPage.find(".option").unbind("click");
                $(this).addClass("word-right");
                if (wordRight) {
                    exerPage.find(".right-count").text(++rightCount);
                    score += 10;
                    exerPage.find(".score").text(score);
                    rightlist.push(exerPage.find(".word-topic").data("wid"));
                } else {
                    wronglist.push(exerPage.find(".word-topic").data("wid"));
                }
                exerPage.find(".total-count").text(++totalCount);
                if (w2mMode == W2mMode.CHALLENGE || w2mMode == W2mMode.ACCEPT_CHALLENGE) {
                    if (!gameOver && stars.go(wordRight)) {
                        effect.play("second5");
                        runCount = runCount + 5 > countdown ? countdown : runCount + 5;
                        exerPage.find(".exercise-time .exer-time").text(Utils.formatTime(runCount));
                        exerPage.find(".exercise-progressbar .highlight").css("left", -((countdown - runCount) / countdown) * 100 + "%");
                    } else {
                        effect.play("click2");
                    }
                    setword(++wordIndex);
                } else {
                    var audio = exerPage.find(".word-topic").data("audiourl");
                    audioPlayer.play(audio);
                }
            } else {
                effect.play("wrong");
                wordRight = false;
                score = score - 5 <= 0 ? 0 : score - 5;
                exerPage.find(".score").text(score);

                if (config.type == W2mType.MATCH) {
                    exerPage.find(".option").unbind("click");
                    exerPage.find(".total-count").text(++totalCount);
                    wronglist.push(exerPage.find(".word-topic").data("wid"));
                    setword(++wordIndex);
                } else {
                    $(this).addClass("word-wrong");
                }
                if (w2mMode == W2mMode.CHALLENGE || w2mMode == W2mMode.ACCEPT_CHALLENGE) {
                    stars.go(false);
                }
            }
        }

        function onRecordClick() {
            //alert("作业");
            //alert("是否AI会员:"+config.payFlag);
            //alert("是否是学生:"+config.userType);
            if (config.userType == 1 && config.payFlag == 0) {
                clearInterval(w2mTimer);
                //alert(config.topInfos);
                //switch (config.programme)
                isPause = true;
                //alert(config.programme);
                // switch (parseInt(config.programme)) {
                // 	case 1:
                // 		arynAlertV2.show(config.topInfos, "支付中心", config.gotoPay);
                // 		break;
                // 	case 2:
                // 		arynAlertV2.show(config.topInfos, "分享给家长", config.unpay2);
                // 		break;
                // 	case 3:
                // 		arynAlertV2.show(config.topInfos, "家长通", config.gotoParentCommunication);
                // 		break;
                // 	case 4:
                // 		arynAlertV2.show(config.topInfos, "返回首页", config.gotoBackHome);
                // 		break;
                // 	default:
                // 		arynAlertV2.show(config.topInfos, "返回首页", config.gotoBackHome);
                // 		break;
                // }
                return;
                var beian = new Beian(config);
                if (!beian.checkFlag(config.payFlag, 1, 1, 2)) return;
            }
            //if (!beian.checkFlag(userFlag, selectBook.finishTimes, maxWorkTimes, 4)) return;
            if (exerPage.find(".record-button").hasClass("recording") ||
                exerPage.find(".record-button").hasClass("disabled") ||
                exerPage.find(".record-button").hasClass("frozen") ||
                promptPopup.visible) {
                return;
            }
            if (audioRecorder.getReady()) {
                recordStart();
            } else {
                audioRecorder.initialize(function(status) {
                    if (status.code == 0) {
                        recordStart();
                    } else {
                        alert(status.message);
                    }
                });
            }
        }

        function recordStart() {

            var inputed = false;
            var inputopen = false;
            var startinput = 0;
            var stopinput = 0;
            audioRecorder.onrecording = function(float32) {
                //var maxval = Math.max(...float32);
                var maxval = Math.max.apply(null, float32);
                var volume = Math.round(maxval * 100);
                if (volume >= 3 && !inputed) {
                    inputed = true;
                } else if (volume < 3 && inputed && !inputopen) {
                    inputopen = true;
                    startinput = new Date().getTime();
                } else if (volume >= 3 && inputed && inputopen) {
                    inputopen = false;
                } else if (volume < 3 && inputed && inputopen) {
                    stopinput = new Date().getTime();
                    if (stopinput - startinput > 1000) {
                        endRecordProgress(recordStop);
                    }
                }
            };

            audioRecorder.start();
            exerPage.find(".record-button").addClass("recording");
            exerPage.find(".word-options").addClass("frozen");
            recordCount++;
            drawRecordProgress(3.5, recordStop);
        }

        function recordStop() {
            exerPage.find(".record-button").removeClass("recording");
            audioRecorder.onrecording = null;
            audioRecorder.stop(function(blob) {
                exerPage.find(".record-button").addClass("frozen");
                recordDiscern(blob, onDiscernSuccess, onDiscernFaile);
            });
        }

        function recordDiscern(blob, onsuccess, onfaile) {

            var filename = "N" + config.domain + "U" + config.userId + "R" + Math.ceil(Math.random() * 1000000);
            var correct = "";
            var other = [];
            exerPage.find(".option").each(function(i) {
                if ($(this).data("answer")) {
                    correct = $(this).text();
                } else {
                    other.push($(this).text());
                }
            });

            var formdata = new FormData();
            formdata.append(filename, blob);
            formdata.append("jac", config.domain + "U" + config.userId);
            formdata.append("correct_word", correct);
            formdata.append("complete_words", other.join(","));

            var xhr = new XMLHttpRequest();

            xhr.addEventListener("load", function(evt) {
                var $xml = $(evt.target.response);
                onsuccess($xml.find("text").text());
            });
            xhr.addEventListener("error", function(evt) {
                onfaile();
            });

            xhr.open("POST", location.protocol + "//read.kouyu100.com/analysis/servlet/RecordDistinguish", false);
            xhr.send(formdata);

        }

        function onDiscernSuccess(result) {
            var option = null;
            exerPage.find(".option").each(function() {
                var text = $(this).text().toLocaleLowerCase();
                var res = result.toLocaleLowerCase();
                var lastIndex = res.lastIndexOf(text);
                if (lastIndex != -1 && lastIndex == (res.length - text.length)) {
                    option = this;
                    return false;
                }
            });
            if (!!option) {
                if ($(option).data("answer")) {
                    exerPage.find(".option").unbind("click");
                    $(option).addClass("record-right");
                    if (wordRight) {
                        exerPage.find(".right-count").text(++rightCount);
                        score += (recordCount == 1 ? 10 : recordCount == 2 ? 5 : 0);
                        exerPage.find(".score").text(score);
                        rightlist.push(exerPage.find(".word-topic").data("wid"));
                    } else {
                        wronglist.push(exerPage.find(".word-topic").data("wid"));
                    }
                    exerPage.find(".total-count").text(++totalCount);
                    if (w2mMode == W2mMode.CHALLENGE || w2mMode == W2mMode.ACCEPT_CHALLENGE) {
                        if (!gameOver && stars.go(wordRight)) {
                            effect.play("second5");
                            runCount = runCount + 5 > countdown ? countdown : runCount + 5;
                            exerPage.find(".exercise-time .exer-time").text(Utils.formatTime(runCount));
                            exerPage.find(".exercise-progressbar .highlight").css("left", -((countdown - runCount) / countdown) * 100 + "%");
                        } else {
                            effect.play("click2");
                        }
                        setword(++wordIndex);
                    } else {
                        var audio = exerPage.find(".word-topic").data("audiourl");
                        audioPlayer.play(audio);
                    }
                } else {
                    //					score = score - 5 <= 0 ? 0 : score - 5;
                    exerPage.find(".score").text(score);
                    exerPage.find(".option").addClass("record-wrong");
                    if (recordCount < recordTotal) {
                        promptPopup.show("未匹配到正确单词，请再说一遍哦~", "确定", onRecordPromptClose);
                    } else {
                        promptPopup.show("您的录音次数已用完，请手动选择正确答案~", "确定", onRecordPromptClose);
                        wordRight = false;
                        exerPage.find(".record-button").addClass("disabled");
                    }
                    exerPage.find(".word-options").removeClass("frozen");
                    exerPage.find(".record-button").removeClass("frozen");

                    if (config.type == W2mType.MATCH) {
                        exerPage.find(".total-count").text(++totalCount);
                        wronglist.push(exerPage.find(".word-topic").data("wid"));
                        setword(++wordIndex);
                    } else {
                        $(this).css("opacity", 0);
                    }
                    if (w2mMode == W2mMode.CHALLENGE || w2mMode == W2mMode.ACCEPT_CHALLENGE) {
                        stars.go(false);
                    }
                }
            } else {
                onDiscernFaile();
            }
        }

        function onDiscernFaile() {
            //			score = score - 5 <= 0 ? 0 : score - 5;
            exerPage.find(".score").text(score);
            exerPage.find(".option").addClass("record-unknown");
            if (recordCount < recordTotal) {
                promptPopup.show("未匹配到正确单词，请再说一遍哦~", "确定", onRecordPromptClose);
            } else {
                promptPopup.show("您的录音次数已用完，请手动选择正确答案~", "确定", onRecordPromptClose);
                wordRight = false;
                exerPage.find(".record-button").addClass("disabled");
            }
            exerPage.find(".word-options").removeClass("frozen");
            exerPage.find(".record-button").removeClass("frozen");
        }

        var canvasTimer = null;

        function drawRecordProgress(duration, onend) {
            var canvas = exerPage.find(".record-button .record-track").get(0);
            var context = canvas.getContext("2d");

            var fps = 100;

            canvasTimer = new Timer(duration * 1000 / fps, fps, onCanvasTiming, onCanvasTimerEnd);

            var lineWidth = 4;
            var lineColor = "#FFF4D4";
            var centerX = canvas.width / 2,
                centerY = canvas.height / 2;
            var step = Math.PI * 2 / fps;

            canvasTimer.start();

            function draw(n) {
                context.lineWidth = lineWidth;
                context.strokeStyle = lineColor;
                context.beginPath();
                context.arc(centerX, centerY, centerY - lineWidth / 2 - 4, -Math.PI / 2, -Math.PI / 2 + n * step, false);
                context.stroke();
                context.closePath();
            }

            function onCanvasTiming() {
                draw(canvasTimer.currentCount());
            }

            function onCanvasTimerEnd() {
                draw(canvasTimer.currentCount());
                setTimeout(function() {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    onend();
                }, 100);
                if (!!canvasTimer) {
                    canvasTimer.reset();
                }
            }
        }

        function endRecordProgress() {
            if (!!canvasTimer) {
                canvasTimer.forceEnd();
            }
        }

        function onRecordPromptClose() {
            exerPage.find(".option").removeClass("record-right record-wrong record-unknown");
        }

        function onWordAudioEnded() {
            setword(++wordIndex);
        }

        function gameEnd() {

            endTime = Math.round(new Date().getTime() / 1000);

            gamedata.msId = worddata.msId;
            gamedata.bookId = bookdata.bookName + "-" + bookdata.lessonName;
            gamedata.bookType = bookdata.bookType;
            gamedata.lessonId = bookdata.lessonId;
            gamedata.lessonName = bookdata.lessonName;
            gamedata.totalNum = totalCount;
            gamedata.wrongNum = totalCount - rightCount;
            gamedata.wrongWordIds = wronglist.join("-");
            gamedata.score = score;
            gamedata.totalTime = endTime - startTime;
            gamedata.save = 1;
            if (w2mMode == W2mMode.CHALLENGE || w2mMode == W2mMode.ACCEPT_CHALLENGE) {
                gamedata.addCount = 0;
                gamedata.wrongCount = 0;
                gamedata.correctWordIds = "";
                gamedata.demandId = worddata.flag == "true" ? worddata.demandId : "request";
                gamedata.avgScore = worddata.avgScore;
            } else {
                gamedata.addCount = totalCount;
                gamedata.wrongCount = totalCount - rightCount;
                gamedata.correctWordIds = rightlist.join("-");
            }

            $(instance).trigger(ExercisePageEvent.GAME_OVER, [w2mMode, gamedata, targetScore]);
        }

        function saveMatchData(index, gameover) {

            endTime = Math.round(new Date().getTime() / 1000);

            $(instance).trigger(ExercisePageEvent.SAVE_MATCH, [w2mMode, {
                gameOver: gameover ? 1 : 0,
                lessonId: bookdata.lessonId,
                lessonName: bookdata.lessonName,
                phbType: bookdata.phbType,
                msId: worddata.msId,
                totalNum: index,
                matchId: config.matchInfo.matchId,
                score: score,
                wrongWordIds: wronglist.join("-"),
                wrongCount: totalCount - rightCount,
                totalTime: endTime - startTime
            }]);
        }

        function matchEnd() {
            $(instance).trigger(ExercisePageEvent.MATCH_OVER);
        }

        function saveWorkData() {

        }

        function workEnd(save) {

            endTime = Math.round(new Date().getTime() / 1000);

            var overData = save ? {
                bookId: bookdata.bookId,
                lessonId: bookdata.lessonId,
                workId: bookdata.workId,
                practiceTime: endTime - startTime,
                practiceNum: totalCount,
                wordScore: score,
                correctWordsIds: rightlist.join("-"),
                wrongWordIds: wronglist.join("-")
            } : null;

            $(instance).trigger(ExercisePageEvent.WORK_OVER, [w2mMode, overData]);
        }

        // 页面渲染
        this.render = function(mode, wdata, bdata, cd) {
            exerPage.show().siblings().hide();
            restore();
            fillPageData(mode, wdata, bdata, cd);
        };

    };

    // 错词回顾页
    var ReviewPage = function(parent, config) {

        var resourcepage = null;
        var worddata = null,
            bookdata = null;

        var reviewPage = $('<div class="w2m-error-review-page">' +
            '<div class="word-resource">单词来源：<span class="lesson-name"></span></div>' +
            '<div class="w2m-error-review-title">本轮错误回顾</div>' +
            '<div class="error-container">' +
            '<div class="error-list"></div>' +
            '</div>' +
            '<div class="w2m-button normal blue return" style="left:325px;" text="确认返回"></div>' +
            '<div class="w2m-button normal yellow add-all" text="全部添加"></div>' +
            '</div>');

        $(parent).append(reviewPage.hide());

        reviewPage.find(".return").unbind("click").bind("click", { instance: this }, onReturn);
        reviewPage.find(".add-all").unbind("click").bind("click", onAddAll).hide();

        function onReturn(evt) {
            reviewPage.find(".error-list").getNiceScroll().remove();
            $(evt.data.instance).trigger(ReviewPageEvent.RETURN, [resourcepage]);
        }

        function onAddAll(evt) {
            var wordIds = [];
            reviewPage.find(".error-list .error-item").each(function() {
                if (!$(this).find(".add-button").hasClass("added")) {
                    wordIds.push($(this).attr("wid"));
                }
            });
            addErrorWord(wordIds.join("-"));
        }

        function fillPageData(wdata, bdata, resource) {

            if (!wdata && !bdata) return;

            worddata = wdata;
            bookdata = bdata;

            reviewPage.find(".lesson-name").text(bookdata.bookName + "-" + bookdata.lessonName);
            reviewPage.find(".error-list").empty();
            reviewPage.find(".errorNoWords").remove();

            console.log(worddata);
            console.log(bookdata);
            resourcepage = resource;

            $.each(worddata.errorWords, function(i, word) {
                var item = createErrorItem(i + 1, word);
                reviewPage.find(".error-list").append(item);
            });
            var emptyWords = $("<div class='errorNoWords'><p>暂无错误单词</p></div>");
            if (worddata.errorWords.length == 0) {
                reviewPage.find(".error-container").append(emptyWords);
            }

            reviewPage.find(".error-list").niceScroll({
                cursorcolor: "#649800",
                background: "#C0D698",
                autohidemode: false,
                cursorborder: "none"
            });
        }

        function createErrorItem(index, word) {

            var pattern = new RegExp(word.word, "gi");
            var example = word.example.replace(pattern, "<span>" + word.word + "</span>");

            //是否已加入单词本-0:未加入,1:已加入
            var isAdd = "";
            if (word.addType == null) {

            } else if (word.addType == '0') {
                isAdd = "'<div class='add-button'></div>'";
            } else if (word.addType == '1') {
                isAdd = "'<div class='add-button added'></div>'";
            }

            var item = $('<div class="error-item" wid="' + word.id + '">' +
                '<p class="serial">' + index + '.</p>' +
                '<p class="word">' + word.word + '</p>' +
                '<p class="translate">' + word.cntext + '</p>' +
                '<p class="example">' + example + '</p>' +
                isAdd +
                '</div>');
            //			if (word.addType == 1) {
            //				item.find(".add-button").addClass("added");
            //			}

            item.find(".add-button").bind("click", function() {
                if ($(this).hasClass("added")) return;
                addErrorWord(item.attr("wid"));
            });

            return item;
        }

        function addErrorWord(wids) {
            if (!wids) return;
            ajax.send("addHandbookWords.action", { wordIds: wids }, function() {
                errorWordAdded(wids);
            }, function() {
                errorWordAdded(wids);
            }, "post", false);
        }

        function errorWordAdded(wids) {
            $.each(wids.split("-"), function(i, id) {
                reviewPage.find(".error-list .error-item[wid=" + id + "] .add-button").addClass("added");
            });
            $.each(worddata.errorWords, function(i, word) {
                $.each(wids.split("-"), function(i, id) {
                    if (id == word.id) {
                        word.addType = 1;
                    }
                });
            });
        }

        // 页面渲染
        this.render = function(wdata, bdata, resource) {
            reviewPage.show().siblings().hide();
            fillPageData(wdata, bdata, resource);
        };

    };

    var StudyAfterPage = function(parent, config) {

        var pagedata = null,
            otherdata = null,
            bookdata = null;

        var studyAfter = $('<div class="w2m-study-after-page">' +
            '<img class="w2m-home-icon" src="' + config.staticPath + 'images/w2m-logo.png" />' +
            '<div class="study-after-body">' +
            '<div class="result-progress">' +
            '<div class="progressbar"><canvas width="80" height="80"></canvas></div>' +
            '<div class="progress-text"><span class="result">0</span>%</div>' +
            '</div>' +
            '<p class="result-tips">本次练习错误率</p>' +
            '<p class="wide">正确：<span class="right-count">0</span>/<span class="total-count">0</span>　　时间：<span class="time">0:00</span></p>' +
            '<p class="tips-box">最近(10次)练习错误率：<span class="last10">0%</span></p>' +
            '<div class="button-box">' +
            '<div class="w2m-button normal blue again" text="再次巩固"></div>' +
            '<div class="w2m-button normal blue review" text="错误回顾"></div>' +
            '<div class="w2m-button normal yellow goon" text="继续学习"></div>' +
            '</div>' +
            '</div>' +
            '</div>');

        $(parent).append(studyAfter.hide());

        studyAfter.find(".again").bind("click", { instance: this }, function(evt) {
            $(evt.data.instance).trigger(StudyAfterEvent.AGAIN);
        });
        studyAfter.find(".review").bind("click", { instance: this }, function(evt) {
            $(evt.data.instance).trigger(StudyAfterEvent.REVIEW, [pagedata]);
        });
        studyAfter.find(".goon").bind("click", { instance: this }, function(evt) {
            $(evt.data.instance).trigger(StudyAfterEvent.GOON);
        });

        function fillPageData(pdata, odata, bdata) {

            if (!pdata && !odata && !bdata) return;

            console.log(pdata);
            console.log(odata);
            console.log(bdata);

            pagedata = pdata;
            otherdata = odata;
            bookdata = bdata;

            studyAfter.find(".result").text((otherdata.wrongNum / otherdata.totalNum * 100).toFixed(0));
            studyAfter.find(".last10").text((otherdata.last10 || 0) + "%");
            //			studyAfter.find(".time").text(Utils.formatTime(otherdata.totalTime));
            studyAfter.find(".time").text("2:00");
            studyAfter.find(".right-count").text(otherdata.totalNum - otherdata.wrongNum);
            studyAfter.find(".total-count").text(otherdata.totalNum);

            drawProgress(otherdata.wrongNum, otherdata.totalNum);
        }

        function drawProgress(count, total) {
            var canvas = studyAfter.find(".progressbar canvas").get(0);
            var context = canvas.getContext("2d");

            context.clearRect(0, 0, canvas.width, canvas.height);

            var lineWidth = 4;
            var lineColor = "#28A5FF";
            var centerX = canvas.width / 2,
                centerY = canvas.height / 2;

            context.lineWidth = lineWidth;
            context.strokeStyle = lineColor;
            context.beginPath();
            context.arc(centerX, centerY, centerY - lineWidth / 2, -Math.PI / 2, Math.PI * 2 * (count / total) - Math.PI / 2, false);
            context.stroke();
            context.closePath();
        }

        this.render = function(pdata, otherdata, bdata) {
            studyAfter.show().siblings().hide();
            fillPageData(pdata, otherdata, bdata);
        };
    };

    var ChallengeAfterPage = function(parent, config) {

        var pagedata = null,
            bookdata = null,
            otherdata = null;

        var targetScore = 0;

        var challAfter = $('<div class="w2m-challenge-after-page">' +
            '<div class="word-resource">单词来源：<span class="lesson-name"></span></div>' +
            '<div class="challenge-result-box">' +
            '<div class="challenge-infor">' +
            '<div class="exer-infor">' +
            '<h4>比赛排名</h4>' +
            '<p>' + (config.type == W2mType.MATCH ? '比赛排名' : '今日排名') + '：<span class="today-ranking">1</span></p>' +
            '<p>时间：<span class="exer-time">00:00</span></p>' +
            '<p>总分：<span class="exer-score">0</span></p>' +
            '<p>正确：<span class="exer-right">0</span><span>/</span><span class="exer-total">0</span></p>' +
            '</div>' +
            '<div class="my-score-infor">我的总分是：<span class="my-score">0</span></div>' +
            '<div class="friend-score-infor"><span class="friend">friend</span>&nbsp;挑战你的总分数是：<span class="friend-score">0</span></div>' +
            '<div class="comment">请加强练习，再接再厉！</div>' +
            '</div>' +
            '<div class="buttons">' +
            '<div class="w2m-button big blue review" text="错误回顾"></div>' +
            '<div class="w2m-button big yellow challenge" text="挑战"></div>' +
            '<div class="w2m-button big green again" text="再来一次(巩固)"></div>' +
            '<div class="w2m-button big blue return" text="返回"></div>' +
            '</div>' +
            '</div>' +
            '</div>');

        $(parent).append(challAfter.hide());

        if (config.challengeHide) {
            challAfter.find(".challenge").remove();
        }

        challAfter.find(".review").bind("click", { instance: this }, function(evt) {
            $(evt.data.instance).trigger(ChallengeAfterEvent.REVIEW, [pagedata]);
        });
        challAfter.find(".challenge").bind("click", { instance: this }, function(evt) {
            $(evt.data.instance).trigger(ChallengeAfterEvent.CHALLENGE);
        });
        challAfter.find(".again").bind("click", { instance: this }, function(evt) {
            $(evt.data.instance).trigger(ChallengeAfterEvent.AGAIN, [targetScore]);
        });
        challAfter.find(".return").bind("click", { instance: this }, function(evt) {
            $(evt.data.instance).trigger(ChallengeAfterEvent.RETURN);
        });

        function restore() {
            challAfter.find(".challenge-result-box").removeClass("challenge-success challenge-draw challenge-faile match-result");
            challAfter.find(".exer-infor").show();
            challAfter.find(".my-score-infor").show();
            challAfter.find(".friend-score-infor").show();
            challAfter.find(".comment").show();
            challAfter.find(".again").show();
            challAfter.find(".w2m-button").removeClass("normal").addClass("big");
        }

        function fillPageData(mode, pdata, odata, bdata, target) {
            if (!pdata && !odata && !bdata) return;

            restore();

            pagedata = pdata;
            otherdata = odata;
            bookdata = bdata;

            console.log("挑战结果页--目标分数：" + target);
            console.log(odata);
            if (otherdata.bookType == 5) {
                challAfter.find(".challenge").hide();
            } else {
                challAfter.find(".challenge").show();
            }
            if (config.type == W2mType.MATCH) {
                challAfter.find(".again").hide();
                challAfter.find(".w2m-button").removeClass("big").addClass("normal");
                challAfter.find(".challenge-result-box").addClass("match-result");
                challAfter.find(".my-score-infor").hide();
                challAfter.find(".friend-score-infor").hide();
            } else if (mode == W2mMode.CHALLENGE) {
                targetScore = parseInt(target);
                if (otherdata.totalScore > targetScore) {
                    // 挑战成功
                    effect.play("success");
                    challAfter.find(".challenge-result-box").addClass("challenge-success");
                    challAfter.find(".my-score-infor").hide();
                    challAfter.find(".friend-score-infor").hide();
                    challAfter.find(".comment").hide();
                } else if (otherdata.totalScore == targetScore) {
                    // 挑战平分
                    effect.play("faile");
                    challAfter.find(".challenge-result-box").addClass("challenge-faile");
                    challAfter.find(".my-score-infor").hide();
                    challAfter.find(".friend-score-infor").hide();
                } else {
                    // 挑战失败
                    effect.play("faile");
                    challAfter.find(".challenge-result-box").addClass("challenge-faile");
                    challAfter.find(".my-score-infor").hide();
                    challAfter.find(".friend-score-infor").hide();
                }
            } else if (mode == W2mMode.ACCEPT_CHALLENGE) {
                targetScore = parseInt(pagedata.inviterScore);
                challAfter.find(".again").hide();
                challAfter.find(".w2m-button").removeClass("big").addClass("normal");
                if (otherdata.totalScore > targetScore) {
                    // 应战成功
                    effect.play("success");
                    challAfter.find(".challenge-result-box").addClass("challenge-success");
                    challAfter.find(".my-score-infor").hide();
                    challAfter.find(".comment").hide();
                } else if (otherdata.totalScore == targetScore) {
                    // 挑战平分
                    effect.play("faile");
                    challAfter.find(".challenge-result-box").addClass("challenge-draw");
                    challAfter.find(".exer-infor").hide();
                } else {
                    // 应战失败
                    effect.play("faile");
                    challAfter.find(".challenge-result-box").addClass("challenge-faile");
                    challAfter.find(".exer-infor").hide();
                }

            }

            challAfter.find(".lesson-name").text(bookdata.bookName + "-" + bookdata.lessonName);

            if (config.type == W2mType.MATCH) {
                challAfter.find(".today-ranking").text(pagedata.mostTop || 1);
            } else {
                challAfter.find(".today-ranking").text(pagedata.todayUser || 1);
            }
            challAfter.find(".exer-time").text(Utils.formatTime(otherdata.totalTime));
            challAfter.find(".exer-score").text(otherdata.totalScore);
            challAfter.find(".exer-right").text(otherdata.totalNum - otherdata.wrongNum);
            challAfter.find(".exer-total").text(otherdata.totalNum);
            challAfter.find(".my-score").text(otherdata.totalScore);
            challAfter.find(".friend").text(pagedata.userName);
            challAfter.find(".friend-score").text(pagedata.inviterScore);
            if (config.type == W2mType.MATCH) {
                challAfter.find(".comment").text("祝你在比赛中取得好成绩，加油！");
            } else {
                challAfter.find(".comment").text("请加强练习，再接再厉！");
            }

        }

        this.render = function(mode, pdata, odata, bdata, target) {
            challAfter.show().siblings().hide();
            fillPageData(mode, pdata, odata, bdata, target);
        };
    };

    // 开始训练前页
    var WorkBeforePage = function(parent, config) {

        var pagedata = null;
        var bookdata = null;

        var studypage = $('<div class="w2m-study-before-page">' +
            '<img class="w2m-icon" src="' + config.staticPath + 'images/w2m-logo.png" />' +
            '<h2><span class="w2m-study-title"></span></h2>' +
            '<div class="w2m-study-info">' +
            '<p>系统会记录你的水平、进展和提高。配合单词本，你能快速学会这些词！</p>' +
            '<p class="title">总体统计:</p>' +
            '<div class="total-box"><p class="total"></p></div>' +
            '<div class="clear-float"></div>' +
            '<p class="title">进展统计:</p>' +
            '<div class="evolve-box"><p class="evolve"></p></div>' +
            '<div class="clear-float"></div>' +
            '<p class="title">你的水平:</p>' +
            '<div class="level-box"><p class="level"></p></div>' +
            '<div class="clear-float"></div>' +
            '</div>' +
            '<div class="w2m-button normal blue return-home" text="返回" style="margin-left: 200px;"></div>' +
            '<div class="w2m-button normal yellow start-study" text="继续学习" style="margin-left: 100px;"></div>' +
            '</div>');

        $(parent).append(studypage.hide());

        var loadWordMatchHtml = $('<div class="load-word-match-bg" style="width: 100%;height: 100%; z-index: 999998;background: #555555;position: absolute;top: 0px;opacity: 0.5;left: 0px;display: none;"></div>' +
            '<div class="load-word-match-div" style="z-index: 999999;width: 238px;height: 166px;background-color: #ffffff;border-radius: 10px;position: fixed;top: 50%;left: 50%;text-align: center;margin-top: -83px;margin-left: -119px;display: none;">' +
            '<img src="' + config.staticPath + 'images/word_load.gif" style="margin: 0 auto;margin-top: 33px;">' +
            '<p style="margin-top:29px;text-align: center;font-family: Microsoft YaHei;font-size: 15px;font-weight: normal;font-stretch: normal;line-height: 24px;letter-spacing: 0px;color: #555555;">词表内容加载中…</p>' +
            '</div>');
        $("body").append(loadWordMatchHtml.hide());
        studypage.find(".start-study").unbind("click").bind("click", { instance: this }, onStudyStart);
        studypage.find(".return-home").unbind("click").bind("click", { instance: this }, onReturnHome);

        function onStudyStart(evt) {
            loadWordMatchHtml.show();
            $(evt.data.instance).trigger(WorkBeforeEvent.START_WORK, bookdata);
        }

        function onReturnHome(evt) {
            $(evt.data.instance).trigger(WorkBeforeEvent.RETURN_HOME);
        }

        // 数据导入到页面
        function fillPageData(pdata, bdata) {

            if (!pdata && !bdata) return;
            console.log("渲染开始学习前页");

            pagedata = pdata;
            bookdata = bdata;

            console.log(pagedata);

            var percent = Math.round(pagedata.studyCount / pagedata.wordsCount * 100);
            var caption = bdata.bookName + "-" + bdata.lessonName;

            var totalText = caption + " 共" + pagedata.wordsCount + "个，现在你在第" + pagedata.roundCount + "轮学习";
            var evolveText = caption + " - 上次练习错误率: <strong>" + pagedata.beforeErrorPercent + "%</strong>，最近１０次错误率: <strong>" + pagedata.before10ErrorPercent + "%</strong>。";

            var details = pagedata.details.split("##");
            var max = Math.floor(details.length / 4);
            var ii = max > 2 ? (max - 2) * 4 : 0;

            for (var i = (max > 2) ? max - 1 : 1; i <= max; i++) {
                evolveText += "<br />第" + i + "轮错误率：<strong>" + details[ii++] + "%</strong>，";
                ii++;
                evolveText += "大家第" + i + "轮平均错误率：<strong>" + details[ii++] + "%</strong>";
                if (config.square == 0) {
                    evolveText += "。";
                } else {
                    evolveText += "，你排名 " + details[ii++] + "。";
                }
            }
            evolveText += "<br />第" + i + "轮错误率：<strong>" + details[ii++] + "%</strong>，";
            totalText += "（进行了" + details[ii++] + "天），此轮已经学了<strong>" + pagedata.studyCount + "</strong>个词，占整体的<strong>" + percent + "%</strong>，放入单词本重点记忆的单词：<strong>" + pagedata.myHandbookCount + "</strong>个。";
            evolveText += "大家第" + i + "轮平均错误率：<strong>" + details[ii++] + "%</strong>。";

            var levelText = "";
            if (pagedata.details == "0##0##0##0##0##0##0") {
                levelText = caption + "的 – <strong>还要学习</strong>";
            } else if (i == 1) {
                if (percent <= 80) {
                    levelText = caption + "的 – <strong>还要学习</strong>";
                } else if (details[0] <= 2) {
                    levelText = caption + "的 – <strong>高手</strong>";
                } else if (details[0] <= 5) {
                    levelText = caption + "的 – <strong>基本掌握</strong>";
                } else {
                    levelText = caption + "的 – <strong>还要学习</strong>";
                }
            } else {
                if (details[(i - 2) * 4] <= 3) {
                    levelText = caption + "的 – <strong>高手</strong>";
                } else if (details[(i - 2) * 4] <= 6) {
                    levelText = caption + "的 – <strong>基本掌握</strong>";
                } else if (details[(i - 2) * 4] <= 10) {
                    levelText = caption + "的 – <strong>还要学习</strong>";
                } else {
                    levelText = caption + "的 – <strong>新手</strong>";
                }
            }

            studypage.find(".w2m-study-title").text(caption);
            studypage.find(".total").html(totalText);
            studypage.find(".evolve").html(evolveText);
            studypage.find(".level").html(levelText);
        }

        // 页面渲染
        this.render = function(pdata, bdata) {
            studypage.show().siblings().hide();
            fillPageData(pdata, bdata);
        };

        // 获取学习前页的页面数据
        this.getPageData = function() {
            return pagedata;
        };

    };

    var WorkAfterPage = function(parent, config) {

        var pagedata = null,
            bookdata = null,
            workdata = null;

        var instance = this;

        var studyAfter = $('<div class="w2m-study-after-page">' +
            '<img class="w2m-home-icon" src="' + config.staticPath + 'images/w2m-logo.png" />' +
            '<div class="study-after-body">' +
            '<div class="result-progress">' +
            '<div class="progressbar"><canvas width="80" height="80"></canvas></div>' +
            '<div class="progress-text"><span class="result">0</span></div>' +
            '</div>' +
            '<p class="result-tips">掌握度</p>' +
            '<p class="wide">累计分数：<span class="score">0</span>　　错误率：<span class="wrong-ratio"></span></p>' +
            '<p class="tips-box"></p>' +
            '<div class="button-box">' +
            '<div class="w2m-button normal blue again" text="再次巩固"></div>' +
            '<div class="w2m-button normal blue review" text="错误回顾"></div>' +
            '<div class="w2m-button normal yellow goon" text="继续学习"></div>' +
            '</div>' +
            '</div>' +
            '</div>');

        $(parent).append(studyAfter.hide());

        studyAfter.find(".again").bind("click", function(evt) {
            $(instance).trigger(WorkAfterEvent.AGAIN);
        });
        studyAfter.find(".review").bind("click", function(evt) {
            $(instance).trigger(WorkAfterEvent.REVIEW, [pagedata]);
        });

        function fillPageData(pdata, bdata, hdata) {

            if (!pdata && !bdata) return;

            console.log(pdata);
            console.log(bdata);
            console.log(hdata);

            pagedata = pdata;
            bookdata = bdata;
            workdata = hdata;

            if (pagedata.noPracticeWord > 0) {
                studyAfter.find(".tips-box").text("您已完成" + pagedata.completeWord + "个单词，当前词表还有" + pagedata.noPracticeWord + "个单词，请点击继续学习完成词表。");
                studyAfter.find(".goon").attr("text", "继续学习").unbind("click").bind("click", goonPractice);
            } else {
                setPracticeStatus(bookdata.bookId, bookdata.lessonId);
                if (isAllComplete()) {
                    studyAfter.find(".tips-box").text("您已完成当前训练所有词表，快去首页看看其他训练吧！");
                    studyAfter.find(".goon").attr("text", "返回首页").unbind("click").bind("click", homeBack);
                } else {
                    studyAfter.find(".tips-box").text("您已完成当前词表,还有" + getUndoneLessonNum() + "个词表，请点击下一练习完成其他词表！");
                    studyAfter.find(".goon").attr("text", "下一练习").unbind("click").bind("click", nextPractice);
                }
            }

            studyAfter.find(".score").text(pagedata.addScore);
            studyAfter.find(".wrong-ratio").text(pagedata.errorRate);
            studyAfter.find(".result").text(pagedata.mastery);

            drawProgress(parseInt(pagedata.mastery), 100);
        }

        function drawProgress(count, total) {
            var canvas = studyAfter.find(".progressbar canvas").get(0);
            var context = canvas.getContext("2d");

            context.clearRect(0, 0, canvas.width, canvas.height);

            var lineWidth = 4;
            var lineColor = "#28A5FF";
            var centerX = canvas.width / 2,
                centerY = canvas.height / 2;

            context.lineWidth = lineWidth;
            context.strokeStyle = lineColor;
            context.beginPath();
            context.arc(centerX, centerY, centerY - lineWidth / 2, -Math.PI / 2, Math.PI * 2 * (count / total) - Math.PI / 2, false);
            context.stroke();
            context.closePath();
        }

        function goonPractice() {
            $(instance).trigger(WorkAfterEvent.GOON);
        }

        function nextPractice() {
            var nextLesson = getNextLesson();
            $(instance).trigger(WorkAfterEvent.NEXT, nextLesson);
        }

        function homeBack() {
            $(instance).trigger(WorkAfterEvent.HOME_BACK);
        }

        function setPracticeStatus(bid, lid) {
            $.each(workdata, function(i, book) {
                if (book.bookId == bid) {
                    $.each(book.lessonInfo, function(j, lesson) {
                        if (lesson.lessonId == lid) {
                            lesson.practiceStatus = 1;
                            lesson.finishStudyTimes += 1;
                            return false;
                        }
                    });
                }
            });
        }

        function getUndoneLessonNum() {
            var count = 0;
            $.each(workdata, function(i, book) {
                $.each(book.lessonInfo, function(j, lesson) {
                    if (lesson.practiceStatus == 0) {
                        count++;
                    }
                });
            });
            return count;
        }

        function isAllComplete() {
            var flag = true;
            $.each(workdata, function(i, book) {
                $.each(book.lessonInfo, function(j, lesson) {
                    if (lesson.practiceStatus == 0) {
                        flag = false;
                        return false;
                    }
                });
            });
            return flag;
        }

        function getNextLesson() {

            var bid = -1,
                lid = -1,
                forflag = true;
            /** 第一步：先检测本书的课的状态(是否练习完成) */
            $.each(workdata, function(i, book) {
                if (book.bookId == bookdata.bookId) {
                    $.each(book.lessonInfo, function(j, lesson) {
                        if (lesson.practiceStatus == 0) {
                            bid = book.bookId;
                            lid = lesson.lessonId;
                            forflag = false;
                            return false;
                        }
                    });
                }
                if (!forflag) {
                    return false;
                }
            });

            if (bid != -1 && lid != -1) {
                return { bid: bid, lid: lid };
            }

            /** 第二步：再检测所有书的课的状态(是否练习完成) */
            forflag = true;
            $.each(workdata, function(i, book) {
                $.each(book.lessonInfo, function(j, lesson) {
                    if (lesson.practiceStatus == 0) {
                        bid = book.bookId;
                        lid = lesson.lessonId;
                        forflag = false;
                        return false;
                    }
                });
                if (!forflag) {
                    return false;
                }
            });
            return { bid: bid, lid: lid };
        }

        this.render = function(pdata, bdata, hdata) {
            studyAfter.show().siblings().hide();
            fillPageData(pdata, bdata, hdata);
        };
    };

    var ChallengeFriendPage = function(parent, config) {

        var pagedata = null,
            bookdata = null;

        var challFriend = $('<div class="w2m-challenge-friend-page">' +
            '<div class="word-resource">单词来源：<span class="lesson-name"></span></div>' +
            '<div class="friend-challenge">' +
            '<p>邀请好友：</p>' +
            '<div class="friend-list-box">' +
            '<div class="friend-list"></div>' +
            '</div>' +
            '</div>' +
            '<div class="w2m-button normal blue return" text="返回"></div>' +
            '<div class="w2m-button normal green submit" text="确定"></div>' +
            '</div>');

        $(parent).append(challFriend.hide());

        challFriend.find(".return").bind("click", { instance: this }, function(evt) {
            challFriend.find(".friend-list").getNiceScroll().remove();
            $(evt.data.instance).trigger(FriendPageEvent.RETURN);
        });

        challFriend.find(".submit").bind("click", { instance: this }, function(evt) {

            var friends = [];

            challFriend.find(".friend-list .friend-item").each(function(i, item) {
                if ($(item).find(".checkbox").hasClass("checked")) {
                    friends.push($(item).data("fid") + "," + $(item).data("fname"));
                }
            });

            if (friends.length == 0) {
                promptPopup.show("请选择挑战对象~", null, null, "确定", null);
            } else {

                var params = {
                    bookName: bookdata.bookName,
                    bookType: bookdata.bookType,
                    lessonName: bookdata.lessonName,
                    lessonId: bookdata.lessonId,
                    invitorOrInviteerIdAndName: friends.join("@@"),
                    bookId: bookdata.bookName + "-" + bookdata.lessonName
                };
                ajax.send("saveInvitorOrInviteer.action", params, function() {
                    promptPopup.show("发送挑战成功~", null, null, "确定", function() {
                        challFriend.find(".friend-list").getNiceScroll().remove();
                        $(evt.data.instance).trigger(FriendPageEvent.HOME_BACK);
                    });
                }, function() {
                    promptPopup.show("发送挑战失败~", null, null, "确定", null);
                }, "post", false);
            }

        });

        function fillPageData(pdata, bdata) {

            if (!pdata && !bdata) return;

            pagedata = pdata;
            bookdata = bdata;

            challFriend.find(".lesson-name").text(bookdata.bookName + "-" + bookdata.lessonName);
            challFriend.find(".friend-list").empty();

            $.each(pagedata.friends, function(i, friend) {
                challFriend.find(".friend-list").append(createFriendItem(friend));
            });

            challFriend.find(".friend-list").niceScroll({
                cursorcolor: "#649800",
                background: "#C0D698",
                autohidemode: false,
                cursorborder: "none"
            });
        }

        function createFriendItem(friend) {
            var friendItem = $('<div class="friend-item"><span class="checkbox"></span><span class="label">' + friend.name + '</span></div>');
            friendItem.data("fid", friend.id).data("fname", friend.name);
            friendItem.find(".checkbox").bind("click", onFriendClick);
            return friendItem;
        }

        function onFriendClick() {
            $(this).toggleClass("checked");
        }

        this.render = function(pdata, bdata) {
            challFriend.show().siblings().hide();
            fillPageData(pdata, bdata);
        };
    };

    // 复习课报告页面
    var ReviewReportPage = function(parent, config) {

        var reviewReport = $('<div class="w2m-review-report-page">' +
            '<div class="review-report-wrapper">' +
            '<div class="report-header">' +
            '<div class="report-banner">恭喜你完成了单词复习，快来看看你的掌握情况吧！</div>' +
            '</div>' +
            '<div class="report-body">' +
            '<div class="report-list-wrapper"></div>' +
            '</div>' +
            '</div>' +
            '<div class="w2m-review-report-return"></div>' +
            '</div>');

        $(parent).append(reviewReport.hide());

        reviewReport.find(".w2m-review-report-return").bind("click", { instance: this }, function(evt) {
            reviewReport.find(".report-list-wrapper").getNiceScroll().remove();
            $(evt.data.instance).trigger(ReviewReportEvent.RETURN);
        });

        function fillPageData(data) {

            reviewReport.find(".report-list-wrapper").empty();

            $.each(data.details, function(i, item) {
                var reportItem = createReportItem(item);
                reviewReport.find(".report-list-wrapper").append(reportItem);
            });

            reviewReport.find(".report-list-wrapper").niceScroll({
                cursorwidth: "6px",
                cursorcolor: "#28A5FF",
                background: "#E6EEF4",
                autohidemode: false,
                cursorborder: "none"
            });

        }

        function createReportItem(item) {

            var reportItem = $('<div class="report-item">' +
                '<p class="report-name">' + item.lessonName + '</p>' +
                '<div class="report-table">' +
                '<div class="table-header">' +
                '<div class="content">内容</div>' +
                '<div class="vocabulary">词汇量</div>' +
                '<div class="first-mastery">初始掌握度</div>' +
                '<div class="mastery">当前掌握度</div>' +
                '<div class="total-round">总共完成轮数</div>' +
                '</div>' +
                '<div class="table-body">' +
                '<div class="content">掌握情况</div>' +
                '<div class="vocabulary">' + item.vocabulary + '个</div>' +
                '<div class="first-mastery">' + item.firstAccuracy + '</div>' +
                '<div class="mastery">' + item.accuracy + '</div>' +
                '<div class="total-round">' + item.roundCount + '轮</div>' +
                '</div>' +
                '</div>' +
                '</div>');

            return reportItem;

        }

        this.render = function(data) {
            reviewReport.show().siblings().hide();
            fillPageData(data);
        };

    };


    // ajax请求封装
    var AjaxHttp = function(bp, dm) {

        var basepath = bp,
            domain = dm;

        var sending = false;

        this.send = function(action, params, onsuccess, onfaile, method, async) {
            console.log("ajax sending: " + sending);
            if (sending) return;

            if (onsuccess != null) {
                sending = true;
            }

            action = basepath + domain + "/" + action;
            params = $.extend(params, { timestamp: new Date().getTime() });
            async = (async == undefined) ? true: async;
            method = method || "get";

            $.ajax({
                type: method,
                url: action,
                async: async,
                data: params,
                success: function(res) {
                    sending = false;
                    if (!!onsuccess) {
                        onsuccess(res);
                    }
                },
                error: function(xhr, text, error) {
                    sending = false;
                    if (!!onfaile) {
                        onfaile(xhr, text, error);
                    }
                }
            });
        };

    };

    // 弹出 词表使用提示
    var WordTip = function(parent, config) {
        var tippopup = $('<div class="w2m-word-tip-container">' +
            '<div class="w2m-word-tip">' +
            '<p>单词两分钟含有以下5类词表，整体按照12345的顺序在前台显示。在各类词表的后面，给出一些此类词表的使用建议。</p>' +
            '<table cellspacing="0">' +
            '<tr class="title"><td>排序</td><td>分类</td><td>使用建议</td></tr>' +
            '<tr><td class="order">1</td><td>小/初/高新课标词汇</td><td>优先小升初、中考、高考总复习使用</td></tr>' +
            '<tr><td class="order">2</td><td>教材分册词表</td><td>寒暑假使用，平时预习或复习巩固使用</td></tr>' +
            '<tr><td class="order">3</td><td>教材分单元词表</td><td>配套教学进度同步使用</td></tr>' +
            '<tr><td class="order">4</td><td>寒暑假专练词表</td><td>寒暑假天天练习使用</td></tr>' +
            '<tr><td class="order">5</td><td>其他培训教材分单元词表</td><td>学校使用相应教材的前提下，拓展练习使用</td></tr>' +
            '</table>' +
            '<p>下图为某学校域下单词两分钟的词表截图，可直观到各类词表的整体情况：</p>' +
            '<img class="word-tip-image" src="' + config.staticPath + 'images/word_tip_image.png" alt="" />' +
            '<div class="w2m-button normal green word-tip-close" text="关闭"></div>' +
            '</div>' +
            '</div>');
        tippopup.find(".word-tip-close").one("click", function() {
            tippopup.remove();
        });
        $(parent).append(tippopup);
    };

    var ArynAlert = function(parent) {

        var arynAlertDiv = $('<div class="aryn-alert-wrapper">' +
            '<div class="aryn-alert">' +
            '<div class="close-x"></div>' +
            '<p class="aryn-alert-message"></p>' +
            '<div class="aryn-alert-button"></div>' +
            '</div>' +
            '</div>');

        this.show = function(message, label, callback) {

            label = label || "确定";

            parent.find(".aryn-alert-wrapper").remove();

            arynAlertDiv.find(".aryn-alert-message").text(message);
            arynAlertDiv.find(".aryn-alert-button").text(label);

            arynAlertDiv.find(".close-x").bind("click", function() {
                arynAlertDiv.remove();
            });
            arynAlertDiv.find(".aryn-alert-button").bind("click", function() {
                arynAlertDiv.remove();
                (callback || NOFUN)();
            });

            parent.append(arynAlertDiv);
        };
    };

    var ArynAlertV2 = function(parent) {

        var arynAlertDiv = $('<div class="aryn-alert-wrapper">' +
            '<div class="aryn-alert">' +
            '<div class="close-x"></div>' +
            '<p class="aryn-alert-message"></p>' +
            '<div class="aryn-alert-button"></div>' +
            '</div>' +
            '</div>');

        this.show = function(message, label, callback) {

            label = label || "确定";

            parent.find(".aryn-alert-wrapper").remove();

            arynAlertDiv.find(".aryn-alert-message").text(message);
            arynAlertDiv.find(".aryn-alert-button").text(label);

            arynAlertDiv.find(".close-x").bind("click", function() {
                arynAlertDiv.remove();
                if (isPause) {
                    exerpageV2.counCountDown();
                    isPause = false;
                }

            });
            arynAlertDiv.find(".aryn-alert-button").bind("click", function() {
                arynAlertDiv.remove();
                (callback || NOFUN)();
            });

            parent.append(arynAlertDiv);
        };
    };
    var ChallPopup = function(parent) {

        var popup = $('<div class="w2m-challenge-popup-wrapper">' +
            '<div class="challenge-popup">' +
            '<div class="message">请选择挑战对象</div>' +
            '<div class="w2m-button button-s green-button return" text="返回"></div>' +
            '</div>' +
            '</div>');

        this.show = function(message, label, callback) {

            label = label || "返回";

            parent.find(".w2m-challenge-popup-wrapper").remove();

            popup.find(".message").html(message);
            popup.find(".return").attr("text", label);

            popup.find(".return").bind("click", function() {
                popup.remove();
                (callback || NOFUN)();
            });

            parent.append(popup);
        };

    };

    var PromptPopup = function(parent) {

        var popup = $('<div class="w2m-prompt-popup-wrapper">' +
            '<div class="prompt-popup">' +
            '<div class="title">提示</div>' +
            '<div class="message"></div>' +
            '<div class="w2m-button normal yellow submit" text="确定"></div>' +
            '<div class="w2m-button normal green cancel" text="取消"></div>' +
            '</div>' +
            '</div>');

        this.visible = false;
        var that = this;

        this.show = function(message, leftlabel, leftcallback, rightlabel, rightcallback) {

            if (leftlabel == null) {
                popup.find(".submit").hide();
            } else {
                popup.find(".submit").attr("text", leftlabel);
            }

            if (rightlabel == null) {
                popup.find(".cancel").hide();
            } else {
                popup.find(".cancel").attr("text", rightlabel);
            }

            if (leftlabel == null && rightlabel == null) {
                popup.find(".submit").show();
            }

            parent.find(".w2m-prompt-popup-wrapper").remove();

            popup.find(".message").html(message);

            popup.find(".submit").bind("click", function() {
                popup.remove();
                that.visible = false;
                (leftcallback || NOFUN)();
            });
            popup.find(".cancel").bind("click", function() {
                popup.remove();
                that.visible = false;
                (rightcallback || NOFUN)();
            });

            parent.append(popup);
            that.visible = true;
        };

    };

    // 挑战进度条 星星组件
    var Stars = function(parent) {
        var stars = $('<div class="stars">' +
            '<div class="star"></div>' +
            '<div class="star"></div>' +
            '<div class="star"></div>' +
            '<div class="star"></div>' +
            '<div class="star"></div>' +
            '<div class="second5">+5</div>' +
            '</div>');
        $(parent).append(stars);

        var count = 0;

        this.go = function(result) {
            if (result) {
                stars.children(".star").eq(count++).addClass("added");
                if (count == stars.children(".star").length) {
                    count = 0;
                    stars.children(".second5").show().fadeOut(800);
                    setTimeout(function() {
                        hideSyncStar();
                    }, 200);
                    return true;
                }
                return false;
            } else {
                hideSyncStar();
                return false;
            }
        };

        this.clear = function() {
            hideSyncStar();
        };

        function hideSyncStar() {
            count = 0;
            stars.children(".star").removeClass("added");
        }

    };

    // 备案信息提示
    var Beian = function(config) {

        var prompt = config.getProgramme();
        if (!prompt || prompt.programme > 4) {
            if (prompt.programme == 6) {
                prompt = {
                    programme: 6,
                    text: {
                        type4: "本功能属于AI会员用户的附赠功能，非AI会员用户此训练只能完成一次，请联系自习室的管理人员进行权限的续费或开通",
                        type5: "本功能属于AI会员用户的附赠功能，非AI会员用户每天体验一次，请联系自习室的管理人员进行权限的续费或开通",
                        type6: "您不是AI会员用户，不能发起挑战，请联系自习室的管理人员进行权限的续费或开通"
                    }
                };
            } else {
                prompt = {
                    programme: 4,
                    text: {
                        type4: "本功能属于AI会员用户的附赠功能，非AI会员用户此训练只能完成一次，请家长登录家长通了解详情",
                        type5: "本功能属于AI会员用户的附赠功能，非AI会员用户每天体验一次，请家长登录家长通了解详情",
                        type6: "您不是AI会员用户，不能发起挑战，请家长登录家长通了解详情"
                    }
                };
            }

        }

        this.checkFlag = function(flag, finish, max, type) {
            if (flag == 0 && finish >= max) {
                switch (prompt.programme) {
                    case 1:
                        arynAlert.show(prompt.text["type" + type], "支付中心", config.gotoPay);
                        break;
                    case 2:
                        arynAlert.show(prompt.text["type" + type], "分享给家长", config.unpay1);
                        break;
                    case 3:
                        arynAlert.show(prompt.text["type" + type], "家长通", config.gotoParentCommunication);
                        break;
                    case 4:
                        arynAlert.show(prompt.text["type" + type], "返回首页", config.gotoBackHome);
                        break;
                    default:
                        arynAlert.show(prompt.text["type" + type], "返回首页", config.gotoBackHome);
                        break;
                }
                return false;
            }
            return true;
        };
    };

    // 工具类
    var Utils = function() {};
    // 接口返回的字符串数据 转换为 对象
    Utils.decodeData = function(res) {
        var newdata = {};
        var params = res.split("&");
        $.each(params, function(index, value) {
            if (!value || value == "") {
                return true;
            }
            var temparam = value.split("=");
            newdata[temparam[0]] = temparam[1];
        });
        return newdata;
    };
    // 挑战信息字符串 转换为 对象
    Utils.parseChallengeInfo = function(challenge) {
        if (!challenge || challenge == "") {
            return null;
        }
        var newlist = [];
        if (!challenge) return newlist;

        var challengelist = challenge.split("@@");
        $.each(challengelist, function(index, item) {
            var challenge = item.split("$$$");
            newlist.push({ name: challenge[0], value: item });
        });
        return newlist;
    };
    // 书列表字符串 转换为 对象
    Utils.parseBookList = function(list) {
        var newlist = [];
        if (!list) return newlist;

        var booklist = list.split("@@");
        $.each(booklist, function(index, item) {
            var book = item.split("##");
            newlist.push({ type: book[0], id: book[1], name: book[2] });
        });
        return newlist;
    };
    // 课列表字符串 转换为 对象
    Utils.parseLessonList = function(list) {
        var newlist = [];
        if (!list) return newlist;

        var lessonlist = list.split("@@");
        $.each(lessonlist, function(index, item) {
            var lesson = item.split("##");
            newlist.push({ id: lesson[0], name: lesson[1] });
        });
        return newlist;
    };
    // 学习的单词列表字符串 转换为 对象
    Utils.parseWordList = function(list) {
        var newlist = [];
        if (!list) return newlist;

        var words = list.split("##");
        $.each(words, function(i, word) {
            word = word.split("@@");
            var wordItem = {
                id: word[0],
                cntext: word[1],
                optionA: word[2],
                optionB: word[3],
                optionC: word[4],
                optionD: word[5],
                word: word[6],
                audio: word[7],
                flag: word[8]
            };
            newlist.push(wordItem);
        });
        return newlist;
    };
    // 挑战的单词列表字符串 转换为 对象
    Utils.parseChallWordList = function(list) {
        var newlist = [];
        if (!list) return newlist;

        var words = list.split("##");
        $.each(words, function(i, word) {
            word = word.split("@@");
            var wordItem = {
                id: word[0],
                cntext: word[1],
                optionA: word[2],
                optionB: word[3],
                optionC: word[4],
                optionD: word[5],
                word: word[6],
                accept: word[7] == "yes",
                challUser: word[8],
                audio: word[9],
                flag: word[10]
            };
            newlist.push(wordItem);
        });
        return newlist;
    };
    // 把单词训练返回的数据格式统一成练习页面需要的数据格式
    Utils.parseWorkWordList = function(list) {
        var newlist = [];
        $.each(list, function(i, word) {
            var wordItem = {
                id: word.wordId,
                cntext: word.cnText,
                optionA: word.matchWords[0],
                optionB: word.matchWords[1],
                optionC: word.matchWords[2],
                optionD: word.matchWords[3],
                word: word.word,
                audio: word.wordMP3,
                flag: word.pic_flag
            };
            newlist.push(wordItem);
        });
        return newlist;
    };
    // 错误单词列表 字符串 转换为 对象
    Utils.parseErrorWordList = function(list) {
        var newlist = [];
        if (!list) return newlist;

        var words = list.split("##");
        $.each(words, function(i, word) {
            word = word.split("@@");
            var wordItem = {
                id: word[0],
                cntext: word[1],
                word: word[2],
                example: word[3],
                other: word[4],
                addType: word[5]
            };
            if (word[5] == undefined) {
                wordItem = {
                    id: word[0],
                    cntext: word[1],
                    word: word[2],
                    example: word[3],
                    other: word[4],
                    addType: word[4]
                };
            }
            newlist.push(wordItem);
        });
        return newlist;
    };
    // 把单词训练的错词数据格式统一成错词页面需要的数据格式
    Utils.parseWorkErrorWordList = function(list) {
        var newlist = [];

        $.each(list, function(i, word) {
            var wordItem = {
                id: word.wordId,
                cntext: word.cnText,
                word: word.word,
                example: word.sentence,
                addType: word.addType
            };
            newlist.push(wordItem);
        });
        return newlist;
    };
    // 错误单词列表 字符串 转换为 对象
    Utils.parseFriendList = function(list) {
        var newlist = [];
        if (!list) return newlist;

        var friends = list.split("##");
        $.each(friends, function(i, friend) {
            friend = friend.split("@@");
            var friendItem = {
                id: friend[0],
                name: friend[1]
            };
            newlist.push(friendItem);
        });
        return newlist;
    };
    // 关键字筛选数列表
    Utils.findBooklistByKey = function(booklist, keyword) {
        var list = [];
        $.each(booklist || [], function(i, book) {
            if (book.name.indexOf(keyword) > -1) {
                list.push(book);
            }
        });
        return list;
    };
    // 关键字筛选数列表
    Utils.formatTime = function(time) {
        var h, m, s;
        h = Math.floor(time / 3600);
        m = Math.floor((time - h * 3600) / 60);
        s = Math.floor(time - h * 3600 - m * 60);
        var hh = h == 0 ? "" : h < 10 ? "0" + h + ":" : h + ":";
        var mm = m < 10 ? "0" + m + ":" : m + ":";
        var ss = s < 10 ? "0" + s : s;
        return hh + mm + ss;
    };
    //获取剩余时间秒数,用于时间继续倒计时
    Utils.formatSecond = function(time) {
        var str = time.split(":");
        var ss = parseInt(str[0] * 60);
        var ss1 = parseInt(str[1].substring(0, 2));
        var sencond = ss + ss1;
        return sencond;
    };

    var effectSources = {
        click: "effects/click.mp3",
        click2: "effects/option-click.mp3",
        right: "effects/choose-right.mp3",
        right2: "effects/right2.mp3",
        wrong: "effects/choose-wrong.mp3",
        success: "effects/success.mp3",
        faile: "effects/faile.mp3",
        second5: "effects/5s.mp3"
    };

    var effectManager = function(config, onprogress, onloaded, onerror) {

        var effectPlayer = new ArivocPlayer({ onAudioError: NOFUN });

        onprogress = onprogress || NOFUN;
        onloaded = onloaded || NOFUN;
        onerror = onerror || NOFUN;

        var effectArray = null;
        var effectBlobs = null;

        var currentIndex = 0;
        var currentName = null;

        var request = new XMLHttpRequest();

        request.onloadstart = function(ev) {
            request.responseType = "blob";
        };

        request.onload = function() {
            if (this.status == 200) {
                effectBlobs[currentName] = this.response;
                currentIndex++;
                console.log(currentIndex + "个已加载完成，共" + effectArray.length + "个");
                if (currentIndex < effectArray.length) {
                    start(currentIndex);
                } else {
                    console.log(effectBlobs);
                }
            } else {
                console.log("effect load error: " + currentName);
            }
        };
        request.onerror = function() {
            onerror();
        };

        function start(index) {
            var effect = effectArray[index];
            currentName = effect.name;

            request.open("GET", config.basePath + config.addPath + effect.path, true);
            request.send();
        }

        function load(effects) {

            effectArray = new Array();
            effectBlobs = new Object();

            currentIndex = 0;

            $.each(effects, function(key, url) {
                effectArray.push({ name: key, path: url });
            });
            if (effectArray.length > 0) {
                start(currentIndex);
            }
        }

        function play(name) {
            if (!effectBlobs[name]) {
                return;
            }
            setTimeout(function() {
                effectPlayer.play(effectBlobs[name]);
            }, 0);
        }

        this.load = load;
        this.play = play;

        load(effectSources);
    };

    // 单词两分钟类型（练习， 训练， 比赛）
    var W2mType = {
        NORMAL: "normal",
        HOMEWORK: "homework",
        MATCH: "match",
        REVISE: "revise"
    };

    // 单词两分钟模式（学习， 挑战， 应战）
    var W2mMode = {
        STUDY: "w2m_mode_study",
        CHALLENGE: "w2m_mode_challenge",
        ACCEPT_CHALLENGE: "w2m_mode_accept_challenge"
    };

    // 首页事件
    var HomePageEvent = {
        // 数据准备好了
        DATA_READY: "home_page_data_ready",
        // 词表使用提示
        WORD_TIP: "home_page_word_tip",
        // 开始学习
        START_STUDY: "home_page_start_study",
        // 开始挑战
        START_CHALLENGE: "home_page_start_challenge",
        // 接受挑战
        ACCEPT_CHALLENGE: "home_page_accept_challenge",
        // 拒绝挑战
        REFUSE_CHALLENGE: "home_page_refuse_challenge",
        // 长期单词复习任务
        LONG_WORD_TASK: "home_page_long_word_task",
    };

    // 单词比赛首页事件
    var MatchHomePageEvent = {
        // 数据准备好了
        DATA_READY: "match_home_page_data_ready",
        // 开始比赛
        START_MATCH: "match_home_page_start_match"
    };

    // 单词训练首页事件
    var WorkHomePageEvent = {
        // 数据准备好了
        DATA_READY: "work_home_page_data_ready",
        // 开始单词训练
        START_WORK: "work_home_page_start_work",
        // 开始学习前页
        START_BEFORE: "work_home_page_start_before"
    };

    // 单词复习课首页事件
    var ReviewHomePageEvent = {
        // 数据准备好了
        DATA_READY: "review_home_page_data_ready",
        // 去复习
        START_REVIEW: "review_home_page_start_review",
        // 查看报告
        GOTO_REPORT: "review_home_page_goto_report"
    };

    // 开始学习前页事件
    var StudyBeforeEvent = {
        START_STUDY: "study_before_page_start_study",
        WRONG_REVIEW: "study_before_page_wrong_review",
        RETURN_HOME: "study_before_page_return_home"
    };

    // 开始挑战前页事件
    var ChallengeBeforeEvent = {
        RETURN: "challenge_before_page_return",
        START_CHALLENGE: "challenge_before_page_start_challenge"
    };

    // 单词训练开始学习前页事件
    var WorkBeforeEvent = {
        RETURN_HOME: "work_before_page_return_home",
        START_WORK: "work_before_page_start_work",
    }

    // 练习页面事件
    var ExercisePageEvent = {
        GAME_OVER: "exer_page_game_over",
        SAVE_MATCH: "exer_page_save_match",
        MATCH_OVER: "exer_page_match_over",
        WORK_OVER: "exer_page_work_over"
    };

    // 学习结果页事件
    var StudyAfterEvent = {
        AGAIN: "study_after_page_again",
        REVIEW: "study_after_page_review",
        GOON: "study_after_page_goon"
    };
    // 挑战结果页事件
    var ChallengeAfterEvent = {
        AGAIN: "challenge_after_page_again",
        REVIEW: "challenge_after_page_review",
        RETURN: "challenge_after_page_return",
        CHALLENGE: "challenge_after_page_challenge"
    };
    // 训练结果页事件
    var WorkAfterEvent = {
        AGAIN: "work_after_page_again",
        REVIEW: "work_after_page_review",
        GOON: "work_after_page_goon",
        NEXT: "work_after_page_next",
        HOME_BACK: "work_after_page_home_back"
    };

    // 错误回顾页面事件
    var ReviewPageEvent = {
        RETURN: "error_review_page_return",
        ADD_ERROR: "error_review_page_add_error"
    };

    // 挑战邀请页面事件
    var FriendPageEvent = {
        RETURN: "challenge_friend_page_return",
        HOME_BACK: "challenge_friend_page_home_back"
    };

    // 挑战邀请页面事件
    var ReviewReportEvent = {
        RETURN: "review_report_page_return"
    };

    // 计时器
    var Timer = function(delay, repeat, timerHandler, timerCompleteHandler) {

        var count = this.count = 0;
        var running = this.running = false;
        var timerid = null;
        var isover = false;

        repeat = repeat == 0 ? Number.MAX_VALUE : repeat;

        function start() {
            if (running || isover) return;
            running = true;
            timerid = setInterval(timing, delay);
        }

        function stop() {
            if (!running) return;
            clearInterval(timerid);
            running = false;
        }

        function reset() {
            stop();
            count = 0;
            isover = false;
        }

        function forceEnd() {
            count = repeat;
            stop();
            isover = true;
            if (!!timerCompleteHandler) { timerCompleteHandler(); }
        }

        function timing() {
            if (count < repeat) {
                count++;
                if (!!timerHandler) { timerHandler(); }
            } else {
                stop();
                isover = true;
                if (!!timerCompleteHandler) { timerCompleteHandler(); }
            }
        }

        this.start = start;
        this.stop = stop;
        this.reset = reset;
        this.forceEnd = forceEnd;

        this.currentCount = function() {
            return count;
        };

        this.totalRepeat = function() {
            return repeat;
        };
    };

    function log(msg) {
        if (debug) {
            console.log(msg);
        }
    }

    $.fn.word2Minutes = function(option) {
        return this.each(function() {
            var w2m = new Word2Minutes(this, option);
            $(this).data("arivoc-word-2minutes", w2m);
        });
    };

}(jQuery, ArivocPlayer, ArivocRecorder);