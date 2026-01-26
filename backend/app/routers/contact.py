from fastapi import APIRouter, status, HTTPException
from app.schemas import ContactCreate
from app.services import contact_service 

router = APIRouter(
    prefix="/contact",
    tags=["Contact"]
)

@router.post("/", status_code=status.HTTP_200_OK)
def send_contact(contact_data: ContactCreate):
    try:
        return contact_service.handle_contact_request(contact_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to send message. Please try again later")