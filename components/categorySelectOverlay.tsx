import React from "react";
import { Div, Button, Text, Overlay, Checkbox } from "react-native-magnus";
import { handleCategoryChange } from "../helpers/categoryHelpers";

export function CategorySelectOverlay(props) {
  const checkBoxes = props.categories.map((category) => {
    return (
      <Checkbox
        key={category.id}
        checked={props.selectedCategories.includes(category)}
        prefix={
          <Text ml={20} flex={1}>
            {category.name}
          </Text>
        }
        onChange={() => {
          const selected = handleCategoryChange(
            props.selectedCategories,
            category
          );

          props.setSelectedCategories(selected);
        }}
      />
    );
  });

  return (
    <Overlay visible={props.overlayVisible} p="xl">
      <Text fontSize="lg" mt="md">
        Kategorie
      </Text>
      <Div mt={20}>{checkBoxes}</Div>
      <Button
        mt={20}
        onPress={() => {
          props.setOverlayVisible(false);
        }}
      >
        OK
      </Button>
    </Overlay>
  );
}
