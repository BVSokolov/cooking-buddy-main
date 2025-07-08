import React, { useEffect, useState } from "react";
import { Recipe } from "../../common/types";
import { Page } from "../UI/Page";
import { Card } from "../UI/Card";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { api } from "../../api/api";

export const RecipePage = () => {
  const { index } = useParams();
  const [recipe, setRecipe] = useState<Recipe>();
  useEffect(() => {
    const getRecipes = async () => {
      const res = await api.recipes.getRecipes();
      if (res.status === 200) {
        setRecipe(res.data[Number(index)]);
      }
    };
    getRecipes();
  }, [index]);

  if (!recipe) return null;

  const {
    id,
    name,
    content: { ingredients, instructions },
  } = recipe;

  return (
    <Page>
      <h2>{name}</h2>
      <div>
        <Card style={{ flexDirection: "column" }}>
          <div>Ingredients</div>
          <Card style={{ flexDirection: "column" }}>
            {Object.values(ingredients).map(({ id, name, value }) => (
              <div key={id}>
                {name}: {value}
              </div>
            ))}
          </Card>
        </Card>
        <Card style={{ flexDirection: "column" }}>
          <div>Instructions</div>
          <Card style={{ flexDirection: "column" }}>
            {Object.values(instructions).map((step, i) => (
              <div key={i}>
                {i + 1}. {step}
              </div>
            ))}
          </Card>
        </Card>
      </div>
    </Page>
  );
};
