var MODE_QUIZ = 'quiz';
var MODE_LANG = 'lang';
var MODE_MATH = 'math';

var CURRENT_MODE = MODE_QUIZ;

var CORRECT_THRESHOLD = 2;

var WORDS = new Array();
var TEST_WORDS = new Array();

var TEST_MODE_RANDOM_REMOVE_THRESHOLD = 1;
var TEST_MODE_RANDOM_FOREVER = 2;
var TEST_MODE_IN_ORDER = 3;

// decrement correct counter on fail
var TEST_DECREMENT_ON_FAIL = false;

var TEST_MODE = TEST_MODE_RANDOM_REMOVE_THRESHOLD;

function addWord(lhs, rhs) {
    WORDS.push([lhs, rhs]);
}

function splitAndTrimWordList(text) {
    var words = text.trim().split(',');
    for (var i in words) {
        words[i] = words[i].trim();
    }
    return words;
}

function showNextWord() {
    if (TEST_WORDS.length === 0) {
        $("#test_check_button").hide();
        $("#test_skip_button").hide();
        $("#id_test_result").html("Du klarade provet!");
        return;
    }
    var last_index = $("#test_index").val();
    var index = 0;
    if (TEST_MODE == TEST_MODE_RANDOM_FOREVER ||
        TEST_MODE == TEST_MODE_RANDOM_REMOVE_THRESHOLD) {
        var attempts = 100;
        while (--attempts > 0) {
            index = Math.floor(Math.random() * TEST_WORDS.length);
            if (TEST_WORDS.length == 1 || index != last_index) {
                break;
            }
        }
    }
    var both = TEST_WORDS[index].words;
    var question_words = splitAndTrimWordList(both[0]);
    var solution_words = splitAndTrimWordList(both[1]);
    if (CONFIG[CURRENT_MODE].is_bidirectional && Math.random() < 0.5) {
        var temp = question_words;
        question_words = solution_words;
        solution_words = temp;
    }
    $('#id_question').html(question_words.join(", "));
    $('#test_solution').val(solution_words.join(","));
    $('#test_answer').val("");
    $('#test_answer').focus();
    $('#test_index').val(index);
}

function showWordList() {
    var list = $("#id_word_list_table");
    list.html('');

    for (var i = 0; i < WORDS.length; i++) {
        var item = $('<tr data-id="'+i+'"></tr>');
        item.append("<td>" + WORDS[i][0] + "</td><td class=\"flux\" id=\"lhs_rhs_glue\">" + CONFIG[CURRENT_MODE].lhs_rhs_glue + "</td><td>" + WORDS[i][1] + '</td><td class="actions"><button href="#" class="remove">&#215;</button></td>');
        list.append(item);
    }
    $(".remove").click(function(e){
       var id = $(e.target).parent().parent().attr('data-id');
       WORDS.splice(id, 1);
       showWordList();
    });

    if(WORDS.length > 0){
        $("#removeAll").show();
    }else{
        $("#removeAll").hide();
    }
    exportWords();
}

function updateScore() {
    if (TEST_MODE == TEST_MODE_RANDOM_REMOVE_THRESHOLD) {
        var total_answers = WORDS.length * CORRECT_THRESHOLD;
        var correct_answers = (WORDS.length - TEST_WORDS.length) * CORRECT_THRESHOLD;
        for (var i = 0; i < TEST_WORDS.length; i++) {
            correct_answers += TEST_WORDS[i].correct;
        }
        $("#id_test_score").html(
            correct_answers + " av " + total_answers + " rätt.");
    } else if (TEST_MODE == TEST_MODE_IN_ORDER) {
        var words_left = WORDS.length - TEST_WORDS.length;
        $("#id_test_score").html(
            TEST_WORDS.length + " av " + WORDS.length + " " +
            CONFIG[CURRENT_MODE].entities_label + " kvar.");
    } else if (TEST_MODE == TEST_MODE_RANDOM_FOREVER) {
        var score = 0;
        for (var i = 0; i < TEST_WORDS.length; i++) {
            score += TEST_WORDS[i].correct;
        }
        $("#id_test_score").html(score + " rätta svar");
    }
}

function handleStartTest() {
    $("#quiz").show();
    $("#input").hide();
    $("#id_start_test").hide();
    $("#id_test_mode").show();
    $("#id_test_score").show();
    $("#id_test_score").html("");
    $("#id_test_result").show();
    $("#id_test_result").html("");
    $("#test_check_button").show();
    $("#test_skip_button").show();
    TEST_WORDS = new Array();
    for (var i = 0; i < WORDS.length; i++) {
        TEST_WORDS.push({
            words: WORDS[i],
            correct: 0
        });
    }
    updateScore();
    showNextWord();
}

function handleStopTest() {
    $("#quiz").hide();
    $("#input").show();
    $("#id_test_mode").hide();
    $("#id_test_score").hide();
    $("#id_test_result").hide();
    $("#id_word_list").show();
    $("#id_start_test").show();
    $("#test_check_button").hide();
    $("#test_skip_button").hide();

    $('[name="word"]').focus();
}

function handleTestCheck() {
    if (TEST_WORDS.length == 0) {
        return;
    }
    var answers = splitAndTrimWordList($.trim($("#test_answer").val().toLowerCase()));
    var solutions = splitAndTrimWordList($.trim($("#test_solution").val().toLowerCase()));
    var index = $("#test_index").val();
    // check answer (can be comma separated array)
    var is_correct = answers.length > 0;
    for (var i in answers) {
        if (solutions.indexOf(answers[i]) < 0) {
            is_correct = false;
        }
    }
    if (!is_correct) {
        $("#id_test_result").html("Fel!");
        // decrement correct counter if set to
        if (TEST_DECREMENT_ON_FAIL && TEST_WORDS[index].correct > 0) {
            --TEST_WORDS[index].correct;
        }
        // show next word if we're going in random order
        if (TEST_MODE == TEST_MODE_RANDOM_REMOVE_THRESHOLD ||
            TEST_MODE == TEST_MODE_RANDOM_FOREVER) {
            showNextWord();
        } else {
            // otherwise just clear the input and let the user try again
            $("#test_answer").val("");
        }
    } else {
        $("#id_test_result").html("Rätt!");
        ++TEST_WORDS[index].correct;
        // remove correctly answered questions if we're going in-order or
        // random with threshold
        if (TEST_MODE == TEST_MODE_IN_ORDER ||
            (TEST_MODE == TEST_MODE_RANDOM_REMOVE_THRESHOLD &&
             TEST_WORDS[index].correct >= CORRECT_THRESHOLD)) {
            TEST_WORDS.splice(index, 1);
        }
        showNextWord();
    }
    updateScore();
}

function handleTestSkip() {
    showNextWord();
}

function setMode(mode){
    $("#mode_select").val(mode);
    CURRENT_MODE = mode;
    $('.flux').each(function(index) {
        this.innerHTML = CONFIG[CURRENT_MODE][this.id];
    });
}

$(document).ready(function() {
    $("#id_show_words_button").hide();
    $("#removeAll").hide();
    $("#id_test_mode").hide();
    $("#id_test_score").hide();
    $("#id_test_result").hide();

    $( "#id_add_word_form" ).submit(function( e ) {
        var word = $.trim($('[name="word"]').val());
        var translation = $.trim($('[name="translation"]').val());
        if(word != '' && translation != ''){
            addWord(word, translation);

            showWordList();

            $("#id_add_word_form")[0].reset();
            $('[name="word"]').focus();
        }
        e.returnValue = false;
        if(e.preventDefault) e.preventDefault();
    });

    $("#removeAll").click( function(){
        WORDS = new Array();
        showWordList();
    });

    $( "#id_test_form" ).submit(function( e ) {
        handleTestCheck();
        e.returnValue = false;
        if(e.preventDefault) e.preventDefault();
    });

    $('[name="word"]').focus();

    //hiding tab content except first one
    $(".tabContent").not(":first").hide();
    // adding Active class to first selected tab and show
    $("ul.tabs li:first").addClass("active").show();

    $('#files').change(handleFileSelect);

    // Click event on tab
    $("ul.tabs li").click(function() {
        // Removing class of Active tab
        $("ul.tabs li.active").removeClass("active");
        // Adding Active class to Clicked tab
        $(this).addClass("active");
        // hiding all the tab contents
        $(".tabContent").hide();
        // showing the clicked tab's content using fading effect
        $($('a',this).attr("href")).fadeIn('fast');

        return false;
    });

    $("#mode_select").change(function() {
        setMode(this.value);
    });
});
