import {Guid} from "../../src/helpers/guid";

test("Unique guids generated", () => {

    expect(Guid.newGuid() == Guid.newGuid()).toBeFalsy();

});

test("Guid length is correct", () => {

    expect(Guid.newGuid().length).toMatchSnapshot();

});