import { expect } from "chai";
import { describe, it } from "mocha";
import { GraphQLClient } from "graphql-request";
const client = new GraphQLClient("http://localhost:4000/graphql");
describe("GraphQL get games API", () => {
  it("should return title and platform", async () => {
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
    expect(data.games).to.be.an("array");
    expect(data.games[0]).to.have.property("id");
    expect(data.games[0]).to.have.property("title");
    expect(data.games[0]).to.have.property("platform");
  });

  it("should return single game with reviews and authors", async () => {
    const query = `
    query Game($gameId: ID!) {
        game(id: $gameId) {
          id
          title
          platform
          reviews {
            rating
            content
            author {
              name
              verified
            }
          }
        }
      }
      `;
    const variables = {
      gameId: "1",
    };
    const data = await client.request(query, variables);
    expect(data.game).to.be.an("object");
    expect(data.game).to.have.property("id");
    expect(data.game).to.have.property("title");
    expect(data.game).to.have.property("platform");
    expect(data.game).to.have.property("reviews");
    expect(data.game.reviews).to.be.an("array");
  });

  it("should return the newly created Game", async () => {
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
    expect(data.addGame).to.be.an("object");
    expect(data.addGame).to.have.property("id");
    expect(data.addGame).to.have.property("title");
    expect(data.addGame).to.have.property("platform");
    expect(data.addGame.title).equals(variables.game.title);
    expect(data.addGame.platform).to.be.an("array");
  });

  it("should return the  updated Game", async () => {
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
    expect(data.updateGame).to.be.an("object");
    expect(data.updateGame).to.have.property("id");
    expect(data.updateGame).to.have.property("title");
    expect(data.updateGame).to.have.property("platform");
    expect(data.updateGame.title).equals(variables.edits.title);
    expect(data.updateGame.platform).to.be.an("array");
  });
});
