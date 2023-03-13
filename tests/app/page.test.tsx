
import Home from "@/app/page";
import {
  describe, it, expect
} from "@jest/globals";
import {
  fireEvent,
  render,
  screen, waitFor
} from "@testing-library/react";
import "@testing-library/jest-dom";
import {UserContext} from "@/contexts/UserContext";
import USER from "@/mocks/user.json";

describe("Given that a user is not logged in", () => {
  beforeEach(() => {
    render(
      <UserContext.Provider value={{user: undefined}}>
        <Home />
      </UserContext.Provider>
    );
  });
  describe("When a user arrives at the Home page", () => {
    it("Then they should see the Welcome text", () => {
      const title = screen.getByText(/Bookie:/i);
      expect(title.textContent).toEqual("Bookie: A fully featured facilities booking website");
      const description = screen.getByText(/Organise your workplace/i);
      expect(description).toBeInTheDocument();
    });
    it("Then they should see the Sign in button", () => {
      const signInButton = screen.getByText(/Sign in/i);
      const roomsButton = screen.queryByText(/Rooms/i);
      const myBookingsButton = screen.queryByText(/My Bookings/i);
      const signOutButton = screen.queryByText(/Log out/i);
      expect(signInButton).toBeInTheDocument();
      expect(roomsButton).toBeNull();
      expect(myBookingsButton).toBeNull();
      expect(signOutButton).toBeNull();
    });
    // describe("When a user clicks on the Sign in button", () => {
    //   it("Then they should be directed to the login page", async () => {
    //     const signInButton = screen.getByRole("link");
    //     console.log(signInButton)
    //     expect(signInButton).toBeInTheDocument();
    //     expect(global.window.location.pathname).toEqual('/');
    //
    //     fireEvent.click(signInButton);
    //     await waitFor(() => {
    //       expect(global.window.location.pathname).toEqual('/login');
    //     });
    //     preview.debug();
    //   });
    // });
  });
});

describe("Given that a user is logged in", () => {
  let logout = jest.fn();

  beforeEach(() => {
    render(
      <UserContext.Provider value={{user: USER, logout: logout}}>
        <Home />
      </UserContext.Provider>
    );
  });
  describe("When a user arrives at the Home page", () => {
    it("Then they should see the Welcome text", () => {
      const title = screen.getByText(/Bookie:/i);
      expect(title.textContent).toEqual("Bookie: A fully featured facilities booking website");
      const description = screen.getByText(/Organise your workplace/i);
      expect(description).toBeInTheDocument();
    });
    it("Then they should see the Rooms, My Bookings and Sign out buttons", () => {
      const signInButton = screen.queryByText(/Sign in/i);
      const roomsButton = screen.getByText(/Rooms/i);
      const myBookingsButton = screen.getByText(/My Bookings/i);
      const signOutButton = screen.getByText(/Log out/i);
      expect(signInButton).toBeNull();
      expect(roomsButton).toBeInTheDocument();
      expect(myBookingsButton).toBeInTheDocument();
      expect(signOutButton).toBeInTheDocument();
    });
    describe("When a user clicks on the Sign out button", () => {
      it("Then the user should be signed out", async () => {
        const signOutButton = screen.getByRole("button");
        expect(signOutButton).toBeInTheDocument();
        expect(global.window.location.pathname).toEqual('/');

        fireEvent.click(signOutButton);
        await waitFor(() => {
          expect(logout).toBeCalledTimes(1);
          expect(global.window.location.pathname).toEqual('/');
        });
      });
      it.todo("Then the user should see the Sign in button");
    });
  });
});