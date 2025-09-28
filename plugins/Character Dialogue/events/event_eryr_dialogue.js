// Plugin
export const id = "EVENT_DIALOGUE_ERYR_NEW";
export const groups = ["EVENT_GROUP_DIALOGUE"];
export const name = "Dialogue - Eryr";

// Portrait
var normalChars = "あÑÒ\nàáâ\nðñò";
var angryChars = "ÓÔÕ\nおえå\nóôõ";
var cheekyChars = "Ö×Ø\næçè\nö÷ø";
var blushChars = "ÙÚÛ\néêë\nùúû";
var youngChars = "ÜÝÞ\nìíî\nüýþ";

export const avatarOrientation = "left";
export const avatarX = 2;
export const avatarY = 2;
export const avatarWidth = 4;

// Text
export const textSpeed = 3;
export const fontPrefix = "\\002\\003";

// Name Tag
export const nameTag = fontPrefix + "ÀÁÂÃ";
export const nameX = 16;

// UI
export const paletteName = "d7591627-265e-499b-b5d5-4eb76939021e";

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
        ["angry", "Angry"],
        ["cheeky", "Cheeky"],
        ["blush", "Blush"],
        ["young", "Young"],
      ],
      defaultValue: "normal",
    },
  ],
);

export const compile = (input, helpers) => {
  const { textDialogue, _getMemInt8, _addComment, _stackPushConst, _stackPop, _set, getVariableAlias, paletteSetUI} = helpers;
  _addComment("Dialogue - Eryr");
  _stackPushConst(0);
  _getMemInt8(".ARG0", "text_draw_speed")
  _set(getVariableAlias("T2"), ".ARG0");
  _stackPop(1);
  paletteSetUI(paletteName);

  var avatarMap = {
    normal: normalChars,
    angry: angryChars,
    cheeky: cheekyChars,
    blush: blushChars,
    young: youngChars,
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
