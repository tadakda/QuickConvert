var https = require('https')

exports.handler = (event, context) => {

  try {

    if (event.session.new) {
      // New Session
      console.log("NEW SESSION")
    }

    switch (event.request.type) {

      case "LaunchRequest":
      // Launch Request
      console.log(`LAUNCH REQUEST`)
      context.succeed(
        generateResponse(
          buildSpeechletResponse("Welcome to Quick Convert. What conversion would you like for me to calculate?", "I can convert any value from Fahrenheit to Celsius, or vice versa. For example, you could open Quick Convert and ask a question like, what is thirty degrees Celsius in Fahrenheit. What conversion would you like me to calculate?", false),
          {}
        )
      )
      break;

      case "IntentRequest":
      // Intent Request
      console.log(`INTENT REQUEST`)

      switch(event.request.intent.name) {
        case "ConvertFToC":
        if (event.request.intent.slots.FahrenheitTemp.value != null) { // if value is valid
          var fahrenheitTemp = (event.request.intent.slots.FahrenheitTemp.value);
          var celsiusTemp = (fahrenheitTemp-32)*(5/9);
          celsiusTemp = Math.round(celsiusTemp*100)/100;
          context.succeed(
            generateResponse(
              buildSpeechletResponse(`${fahrenheitTemp} degrees Fahrenheit is ${celsiusTemp} degrees Celsius.`, null, true),
              {}
            )
          )
        }
        else {
          context.succeed(
            generateResponse(
              buildSpeechletResponse("I'm sorry, I didn't understand that number. Please try again by providing a proper numerical value, for example, sixty. What conversion would you like to make?", null, false),
              {}
            )
          )
        }
        break;


        case "ConvertCToF":
        if (event.request.intent.slots.CelsiusTemp.value != null) {
          var celsiusTemp = (event.request.intent.slots.CelsiusTemp.value);
          var fahrenheitTemp = (celsiusTemp*1.8)+32;
          fahrenheitTemp = Math.round(fahrenheitTemp*100)/100;
          context.succeed(
            generateResponse(
              buildSpeechletResponse(`${celsiusTemp} degrees Celsius is ${fahrenheitTemp} degrees Fahrenheit.`, null, true),
              {}
            )
          )
        }
        else {
          context.succeed(
            generateResponse(
              buildSpeechletResponse("I'm sorry, I didn't understand that number. Please try again by providing a proper numerical value, for example, sixty. What conversion would you like to make?", null, false),
              {}
            )
          )
        }
        break;

        case "ConvertCToFNeg":
        var value = event.request.intent.slots.CelsiusTempNeg.value
        if (value != null) {
          var celsiusTemp = -(event.request.intent.slots.CelsiusTempNeg.value);
          var fahrenheitTemp = (celsiusTemp*1.8)+32;
          fahrenheitTemp = Math.round(fahrenheitTemp*100)/100;
          celsiusTemp = Math.abs(celsiusTemp);
          context.succeed(
            generateResponse(
              buildSpeechletResponse(`Negative ${celsiusTemp} degrees Celsius is ${fahrenheitTemp} degrees Fahrenheit.`, null, true),
              {}
            )
          )
        }
        else {
          context.succeed(
            generateResponse(
              buildSpeechletResponse("I'm sorry, I didn't understand that number. Please try again by providing a proper numerical value, for example, sixty. What conversion would you like to make?", null, false),
              {}
            )
          )
        }
        break;

        case "ConvertFToCNeg":
        var value = event.request.intent.slots.FahrenheitTempNeg.value
        if (value != "?") {
          var fahrenheitTemp = -(event.request.intent.slots.FahrenheitTempNeg.value);
          var celsiusTemp = (fahrenheitTemp-32)*(5/9);
          celsiusTemp = Math.round(celsiusTemp*100)/100;
          fahrenheitTemp = Math.abs(fahrenheitTemp);
          context.succeed(
            generateResponse(
              buildSpeechletResponse(`Negative ${fahrenheitTemp} degrees Fahrenheit is ${celsiusTemp} degrees Celsius.`, null, true),
              {}
            )
          )
        }
        else {
          context.succeed(
            generateResponse(
              buildSpeechletResponse("I'm sorry, I didn't understand that number. Please try again by providing a proper numerical value, for example, sixty. What conversion would you like to make?", null, false),
              {}
            )
          )
        }
        break;

        case "AMAZON.HelpIntent":
        // Help Intent
        console.log(`HELP INTENT`)
        context.succeed(
          generateResponse(
            buildSpeechletResponse("I can convert any value from Fahrenheit to Celsius, or vice versa. For example, you could open Quick Convert and ask a question like, what is thirty degrees Celsius in Fahrenheit. Or, you can say exit. What conversion would you like me to calculate?", null, false),
            {}
          )
        )
        break;

        case "AMAZON.CancelIntent":
        // Cancel Intent
        console.log(`CANCEL INTENT`)
        context.succeed(
          generateResponse(
            buildSpeechletResponse("", null, true),
            {}
          )
        )
        break;

        case "AMAZON.StopIntent":
        // Stop Intent
        console.log(`STOP INTENT`)
        context.succeed(
          generateResponse(
            buildSpeechletResponse("", null, true),
            {}
          )
        )
        break;

        default:
        throw "Invalid intent"
      }
      break;

      case "SessionEndedRequest":
      // Session Ended Request
      console.log(`SESSION ENDED REQUEST`)
      break;

      default:
      context.fail(`INVALID REQUEST TYPE: ${event.request.type}`)

    }

  } catch(error) { context.fail(`Exception: ${error}`) }

}

// Helpers
buildSpeechletResponse = (outputText, repromptText, shouldEndSession) => {

  return {
    outputSpeech: {
      type: "PlainText",
      text: outputText
    },
    reprompt: {
      outputSpeech: {
        "type": "PlainText",
        "text": repromptText
      }
    },
    shouldEndSession: shouldEndSession
  }

}

generateResponse = (speechletResponse, sessionAttributes) => {

  return {
    version: "1.0",
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  }

}
