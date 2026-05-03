# Tasks

> Source: https://developer.focus.teamleader.eu/docs/api/projects-v-2-tasks

-   [](/)
-   [API Reference](/docs/api)
-   New Projects
-   Tasks

# Tasks

\> _These endpoints are for (new) project tasks. For documentation on endpoints for tasks not linked to a project, see **Tasks** below._

_**Required scopes:**_ `projects`

[

## 📄️ tasks.list

Lists all the tasks that match the optional filters provided.

](/docs/api/nextgen-projects-tasks-list)

[

## 📄️ tasks.info

Returns all the information for one task.

](/docs/api/nextgen-projects-tasks-info)

[

## 📄️ tasks.create

Create a task. All properties except for \`title\` and \`project\_id\` are optional.

](/docs/api/nextgen-projects-tasks-create)

[

## 📄️ tasks.update

Update a task. All attributes except for \`id\` are optional. Providing \`null\` will clear that value from the project (for properties that are nullable).

](/docs/api/nextgen-projects-tasks-update)

[

## 📄️ tasks.duplicate

Duplicate a task, without its time trackings.

](/docs/api/nextgen-projects-tasks-duplicate)

[

## 📄️ tasks.delete

Delete a task.

](/docs/api/nextgen-projects-tasks-delete)

[

## 📄️ tasks.assign

Assign a user or a team to a task.

](/docs/api/nextgen-projects-tasks-assign)

[

## 📄️ tasks.unassign

Unassign a user or a team from a task.

](/docs/api/nextgen-projects-tasks-unassign)

[

Previous

projectGroups.unassign

](/docs/api/project-groups-unassign)[

Next

tasks.list

](/docs/api/nextgen-projects-tasks-list)