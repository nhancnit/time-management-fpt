#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <ctype.h>
struct Book {
    char name[100];
    int id;
    float price;
};

void findHighestPriceBook(struct Book books[], int n) {
	//@STUDENT:ADD YOUR CODE 
  int maxIndex = 0;

  for (int i = 1; i < n; i++) {
    if (books[i].price > books[maxIndex].price) {
      maxIndex = i;
    }
  }

  printf("Book Name: %s\n", books[maxIndex].name);
  printf("Book ID: %d\n", books[maxIndex].id);
  printf("Price: %.2f", books[maxIndex].price);

  // Fixed Do not edit anything here.
}
int main() {
  system("cls");
  //INPUT - @STUDENT:ADD YOUR CODE FOR INPUT HERE:
  int n = 0;
  scanf("%d", &n);

  struct Book *books = (struct Book *)malloc(n * sizeof(struct Book));

  for (int i = 0; i < n; i++) {
    scanf(" ");
    fgets(books[i].name, sizeof(books[i].name), stdin);
    books[i].name[strcspn(books[i].name, "\n")] = '\0';
    scanf("%d", &books[i].id);
    scanf("%f", &books[i].price);
  }

  // Fixed Do not edit anything here.
  printf("\nOUTPUT:\n");
  //@STUDENT: WRITE YOUR OUTPUT HERE:
  findHighestPriceBook(books, n);

  free(books);

  //--FIXED PART - DO NOT EDIT ANY THINGS HERE
  printf("\n");
  system ("pause");
  return(0);
}
