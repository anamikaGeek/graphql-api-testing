const { GraphQLClient } = require("graphql-request");

const endpoint = "http://localhost:4000";
const client = new GraphQLClient(endpoint);
describe("GraphQL Queries and Mutations", () => {
  test("should return all the games", async () => {
    const query = `
    query Games {
        games {
          id
          title
          platform
        }
      }
        `;
    const data = await client.request(query);
    expect(Array.isArray(data.games)).toBe(true);
    expect(typeof data.games[0]).toBe("object");
  });
  test("should return the newly created game", async () => {
    const mutation = `
        mutation Mutation($game: AddGameInput) {
          addGame(game: $game) {
            id
            title
            platform
          }
        }
          `;
    const variables = {
      game: {
        title: "A title freshly Added",
        platform: ["platform 1, platform 2"],
      },
    };
    const data = await client.request(mutation, variables);
    expect(data.addGame).toMatchObject({
      title: variables.game.title,
      platform: variables.game.platform,
    });
    expect(Array.isArray(data.addGame.platform)).toBe(true);
  });

  test("should return the  updated Game", async () => {
    const mutation = `
        mutation UpdateGame($updateGameId: ID!, $edits: EditGameInput!) {
          updateGame(id: $updateGameId, edits: $edits) {
            id
            title
            platform
          }
        }
          `;
    const variables = {
      updateGameId: "1",
      edits: {
        title: "Updated Title",
        platform: ["platform one, platform 2"],
      },
    };
    const data = await client.request(mutation, variables);
    expect(data.updateGame).toMatchObject({
      id: variables.updateGameId,
      title: variables.edits.title,
    });
    expect(Array.isArray(data.updateGame.platform)).toBe(true);
  });

  test("should not add a new game with invalid input", async () => {
    const mutation = `
        mutation Mutation($game: AddGameInput) {
          addGame(game: $game) {
            id
            title
            platform
          }
        }
          `;
    const variables = {
      user: {
        title: "A title freshly Added",
        platform: ["platform 1, platform 2"],
      },
    };
    try {
      await client.request(mutation);
    } catch (error) {
      console.log("error", error.response);
      expect(error.response.errors[0].message).toBe(
        "Cannot return null for non-nullable field Game.title."
      );
    }
  });
});
