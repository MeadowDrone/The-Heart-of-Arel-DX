// Plugin
export const id = "EVENT_DIALOGUE_ERIKA";
export const groups = ["EVENT_GROUP_DIALOGUE"];
export const name = "Dialogue - Erika";

// Portrait
var normalChars = "あÑÒ\nàáâ\nðñò";
var blushChars = "ÓÔÕ\nおえå\nóôõ";
var happyChars = "Ö×Ø\næçè\nö÷ø";
var sweatChars = "ÙÚÛ\néêë\nùúû";
var fifthChars = "ÜÝÞ\nìíî\nüýþ";

export const avatarOrientation = "left";
export const avatarX = 2;
export const avatarY = 2;
export const avatarWidth = 4;

// Text
export const textSpeed = 3;
export const fontPrefix = "\\002\\005";

// Name Tag
export const nameTag = fontPrefix + "ÀÁÂÃ";
export const nameX = 16;

// UI
export const paletteName = "1d5e87f9-41d5-4e41-ab99-b034ad8da07a";

// Event Box
export const fields = [].concat(
  [
    {
      key: "text",
      type: "textarea",
      placeholder: "Text...",
      multiple: true,
      defaultValue: "",
      flexBasis: "100%",
    },
    {
      key: "portraitType",
      label: "Portrait",
      type: "select",
      options: [
        ["normal", "Normal"],
        ["blush", "Blush"],
        ["happy", "Happy"],
        ["sweat", "Sweat"],
      ],
      defaultValue: "normal",
    },
  ],
);

export const compile = (input, helpers) => {
  const { textDialogue, _getMemInt8, _addComment, _stackPushConst, _stackPop, _set, getVariableAlias, paletteSetUI} = helpers;
  _addComment("Dialogue - Erika");
  _stackPushConst(0);
  _getMemInt8(".ARG0", "text_draw_speed")
  _set(getVariableAlias("T2"), ".ARG0");
  _stackPop(1);
  paletteSetUI(paletteName);

  var avatarMap = {
    normal: normalChars,
    blush: blushChars,
    happy: happyChars,
    sweat: sweatChars,
  };
  var avatarChars = fontPrefix + avatarMap[input.portraitType];

  input.text.forEach((e, i) => {
    input.text[i] += "\n".repeat(
      Math.max(
        (avatarChars.match(/\n/g) || []).length -
          (e.match(/\n/g) || []).length,
        0
      )
    );
  });
  [...avatarChars.matchAll(/\n/g)].forEach((e, i) => {
    avatarChars = avatarChars.replace(
      "\n",
      `\\003\\${oct(avatarX)}\\${oct(avatarY + i + 1)}`
    );
  });

  // Select font by prepending prefix
  input.text[0] = fontPrefix + input.text[0];

  textDialogue(
    input.text.map(
      (e) =>
        `\\001\\001\\003\\${oct(nameX)}\\001${nameTag}\\003\\${oct(
          avatarX
        )}\\${oct(avatarY)}${avatarChars}\\003\\${oct(
          avatarOrientation == "left" ? avatarWidth + avatarX : 2
        )}\\002\\001\\${oct(textSpeed)}${e || " "}`
    )
  );
};

module.exports = {
  id,
  name,
  groups,
  fields,
  compile,
  waitUntilAfterInitFade: true,
};
const oct = num => ((256 + (num % 256)) % 256).toString(8).padStart(3, "0");
