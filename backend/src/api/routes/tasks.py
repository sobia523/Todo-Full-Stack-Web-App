from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List
import logging
import uuid

from ...models.task import (
    TaskRead, TaskCreate, TaskUpdate, TaskToggleComplete
)
from ...services.task_service import TaskService
from ..deps import get_db_session
from ...auth.middleware import get_current_user
from ...models.user import User as AuthUser

# Set up logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

router = APIRouter()


@router.get("/tasks")
def list_tasks(current_user: AuthUser = Depends(get_current_user), session: Session = Depends(get_db_session)):
    """List all tasks for the authenticated user"""
    logger.info(f"Getting tasks for user_id: {current_user.id}")
    tasks = TaskService.get_tasks_by_user_id(session=session, user_id=current_user.id)
    logger.info(f"Retrieved {len(tasks)} tasks for user_id: {current_user.id}")
    return {
        "success": True,
        "data": {
            "tasks": tasks,
            "pagination": {
                "page": 1,
                "limit": len(tasks),
                "total": len(tasks),
                "has_next": False,
                "has_prev": False
            }
        }
    }


@router.post("/tasks", status_code=201)
def create_task(task_create: TaskCreate, current_user: AuthUser = Depends(get_current_user), session: Session = Depends(get_db_session)):
    """Create a new task for the authenticated user"""
    logger.info(f"Creating task for user_id: {current_user.id}")
    task = TaskService.create_task(session=session, task_create=task_create, user_id=current_user.id)
    logger.info(f"Created task with id: {task.id} for user_id: {current_user.id}")
    return {"success": True, "data": task}


@router.get("/tasks/{id}")
def get_task(id: int, current_user: AuthUser = Depends(get_current_user), session: Session = Depends(get_db_session)):
    """Get details of a specific task for the authenticated user"""
    logger.info(f"Getting task with id: {id} for user_id: {current_user.id}")
    task = TaskService.get_task_by_id(session=session, task_id=id, user_id=current_user.id)
    if not task:
        logger.warning(f"Task with id: {id} not found for user_id: {current_user.id}")
        raise HTTPException(status_code=404, detail="Task not found or user doesn't own the task")
    logger.info(f"Retrieved task with id: {id} for user_id: {current_user.id}")
    return {"success": True, "data": task}


@router.put("/tasks/{id}")
def update_task(id: int, task_update: TaskUpdate, current_user: AuthUser = Depends(get_current_user), session: Session = Depends(get_db_session)):
    """Update a specific task for the authenticated user"""
    logger.info(f"Updating task with id: {id} for user_id: {current_user.id}")
    task = TaskService.update_task(session=session, task_id=id, user_id=current_user.id, task_update=task_update)
    if not task:
        logger.warning(f"Task with id: {id} not found for user_id: {current_user.id}")
        raise HTTPException(status_code=404, detail="Task not found or user doesn't own the task")
    logger.info(f"Updated task with id: {id} for user_id: {current_user.id}")
    return {"success": True, "data": task}


@router.delete("/tasks/{id}")
def delete_task(id: int, current_user: AuthUser = Depends(get_current_user), session: Session = Depends(get_db_session)):
    """Delete a specific task for the authenticated user"""
    logger.info(f"Deleting task with id: {id} for user_id: {current_user.id}")
    success = TaskService.delete_task(session=session, task_id=id, user_id=current_user.id)
    if not success:
        logger.warning(f"Task with id: {id} not found for user_id: {current_user.id}")
        raise HTTPException(status_code=404, detail="Task not found or user doesn't own the task")
    logger.info(f"Deleted task with id: {id} for user_id: {current_user.id}")
    return {"success": True, "data": None, "message": "Task deleted successfully"}


@router.post("/tasks/{id}/toggle")
def toggle_task_completion(id: int, toggle_data: TaskToggleComplete, current_user: AuthUser = Depends(get_current_user), session: Session = Depends(get_db_session)):
    """Toggle completion status of a specific task for the authenticated user"""
    logger.info(f"Toggling completion status for task with id: {id} for user_id: {current_user.id}")
    task = TaskService.toggle_task_completion(session=session, task_id=id, user_id=current_user.id, toggle_data=toggle_data)
    if not task:
        logger.warning(f"Task with id: {id} not found for user_id: {current_user.id}")
        raise HTTPException(status_code=404, detail="Task not found or user doesn't own the task")
    logger.info(f"Toggled completion status for task with id: {id} for user_id: {current_user.id}")
    return {"success": True, "data": task}