### Developer Notes
![Preview of Application](https://gitlab.com/rocketlabusa/business-automation/flame-recruitment/henry-oliver-fe/-/raw/pesudo-main/git-resource/preview.gif?ref_type=heads)

#### Build and Test
Build/Run:
```
$npm install
$ng serve
```

#### Deviations
Nodes:
- A visual node tree 
- The ability to have more than one root node/tree
- Full node and subtree deletion
- Node creation
- Modifying nodes

### Frontend Development

#### Overview

This challenge will test the following skills:
- Browser familiarity

- Angular proficiency

Allow at least 3 hours to complete

Do not be discouraged if you are unable to complete aspects of the challenge, it is designed to test all levels of ability

#### Rules

- Complete the test(s) on your own

- Referencing of online resources is expected, you should comment with a reference when you do

- All code should be pushed to the provided repository

- You are encouraged to ask us questions at any point

- Note any deviations from the specification

- You may use any supporting library you deem appropriate

#### Instructions

1.  Create a new Angular CLI project

2.  Make 2 new components

- **Component A**
  - Retrieve data from the backend app you made in the prior task

  - Should have an input box to enter a node path

  - On each keypress the component should query the backend for a subtree matching that path. Inflight requests should be canceled for new ones

  - Use Component B to render the returned subtree

- **Component B**
  - Should render a single node tree and all properties

  - The label of a property should be GREEN if the value is greater than 10

3.  Use Angular Material for the following

- Use the Dialog component to make a reusable "Confirm" box

- Use the above component to make a delete button with confirmation for each node (this does not need to be connected to the backend) 

4.  Create a Pipe

- This pipe should render how long ago it was since this item was created (e.g _'created 1 hour ago'_)

- Implement this pipe onto each item in the displayed tree

5.  Create a unit test to assert that the colour of the Component B label behaves as specified

### Bonus

6.  Remove zone.js and instead use NoopZone
