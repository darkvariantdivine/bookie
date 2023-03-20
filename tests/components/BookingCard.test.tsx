
import {
  describe, it, expect
} from "@jest/globals";
import {
  render,
  screen
} from "@testing-library/react";
import "@testing-library/jest-dom";
import {UserContext} from "@/contexts/UserContext";
import USER from "@/mocks/user.json";
import ROOMS from "@/mocks/rooms.json"
import BookingCard from "@/components/BookingCard";

describe("Given that a user is not logged in", () => {
  beforeEach(() => {
    render(
      <UserContext.Provider value={{user: undefined}}>
        <BookingCard room={ROOMS[0]}/>
      </UserContext.Provider>
    );
  });
  describe("When a user is viewing a Booking Card", () => {
    it("Then they should see the Photo Carousel", () => {
      const carousel = screen.getAllByAltText(/Meeting room/i);
      expect(carousel.length).toEqual(5);
    });
    it("Then they should see the Room details", () => {
      const roomName = screen.getByText(/Meeting Room/i);
      expect(roomName.textContent).toEqual("Meeting Room 1");
      const capacity = screen.getByText(/Pax/i);
      expect(capacity.textContent).toEqual("Pax: 1");
      const description = screen.getByText(/Lorem ipsum/i);
      expect(description).toBeInTheDocument();
    });
    it("Then they should see the Sign In button", () => {
      const signInButton = screen.getByText(/Sign In/i);
      const bookNowButton = screen.queryByText(/Book Now/i);
      expect(signInButton).toBeInTheDocument();
      expect(bookNowButton).toBeNull();
    });
  });
});

describe("Given that a user is logged in", () => {
  beforeEach(() => {
    render(
      <UserContext.Provider value={{user: USER}}>
        <BookingCard room={ROOMS[0]}/>
      </UserContext.Provider>
    );
  });
  describe("When a user is viewing a Booking Card", () => {
    it("Then they should see the Photo Carousel", () => {
      const carousel = screen.getAllByAltText(/Meeting room/i);
      expect(carousel.length).toEqual(5);
    });
    it("Then they should see the Room details", () => {
      const roomName = screen.getByText(/Meeting Room/i);
      expect(roomName.textContent).toEqual("Meeting Room 1");
      const capacity = screen.getByText(/Pax/i);
      expect(capacity.textContent).toEqual("Pax: 1");
      const description = screen.getByText(/Lorem ipsum/i);
      expect(description).toBeInTheDocument();
    });
    it("Then they should see the Book Now button", () => {
      const signInButton = screen.queryByText(/Sign In/i);
      const bookNowButton = screen.getByText(/Book Now/i);
      expect(signInButton).toBeNull();
      expect(bookNowButton).toBeInTheDocument();
    });
  });
});