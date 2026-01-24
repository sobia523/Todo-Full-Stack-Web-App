import uuid
from typing import List, Optional
from sqlmodel import Session, select
from ..models.task import Task, TaskCreate, TaskUpdate, TaskToggleComplete
from ..models.user import User
from fastapi import HTTPException
from sqlalchemy import func


class TaskService:
    @staticmethod
    def create_task(*, session: Session, task_create: TaskCreate, user_id: uuid.UUID) -> Task:
        """Create a new task for a specific user"""
        # db_task = Task.model_validate(task_create) # This fails because user_id is missing
        db_task = Task(**task_create.model_dump(), user_id=user_id)

        session.add(db_task)
        session.commit()
        session.refresh(db_task)

        return db_task

    @staticmethod
    def get_tasks_by_user_id(*, session: Session, user_id: uuid.UUID) -> List[Task]:
        """Get all tasks for a specific user"""
        statement = select(Task).where(Task.user_id == user_id)
        tasks = session.exec(statement).all()
        return tasks

    @staticmethod
    def get_task_by_id(*, session: Session, task_id: int, user_id: uuid.UUID) -> Optional[Task]:
        """Get a specific task by ID for a specific user"""
        statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        task = session.exec(statement).first()
        return task

    @staticmethod
    def update_task(*, session: Session, task_id: int, user_id: uuid.UUID, task_update: TaskUpdate) -> Optional[Task]:
        """Update a specific task for a specific user"""
        statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        db_task = session.exec(statement).first()

        if not db_task:
            return None

        task_data = task_update.model_dump(exclude_unset=True)
        for field, value in task_data.items():
            setattr(db_task, field, value)

        db_task.updated_at = func.now()
        session.add(db_task)
        session.commit()
        session.refresh(db_task)

        return db_task

    @staticmethod
    def delete_task(*, session: Session, task_id: int, user_id: uuid.UUID) -> bool:
        """Delete a specific task for a specific user"""
        statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        db_task = session.exec(statement).first()

        if not db_task:
            return False

        session.delete(db_task)
        session.commit()
        return True

    @staticmethod
    def toggle_task_completion(*, session: Session, task_id: int, user_id: uuid.UUID, toggle_data: TaskToggleComplete) -> Optional[Task]:
        """Toggle completion status of a specific task for a specific user"""
        statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        db_task = session.exec(statement).first()

        if not db_task:
            return None

        db_task.completed = toggle_data.completed
        db_task.updated_at = func.now()
        session.add(db_task)
        session.commit()
        session.refresh(db_task)

        return db_task